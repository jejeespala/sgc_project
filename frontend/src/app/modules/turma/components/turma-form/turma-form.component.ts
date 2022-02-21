import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColaboradorModel } from 'src/app/modules/colaborador/model/colaborador.model';
import { CompetenciaModel } from 'src/app/modules/competencia/model/competencia.models';
import { Status } from '../../model/status.model';
import { StatusService } from '../../service/status.service';
import { TurmaService } from '../../service/turma.service';
import { SelectItem } from 'primeng/api';
import { Turma } from '../../model/turma.model';
import { TurmaDtoInput } from '../../model/turma-dto-input.model';
import { CompetenciaColaborador } from '../../model/competencia-colaborador.model';

@Component({
    selector: 'app-turma-form',
    templateUrl: './turma-form.component.html',
    styleUrls: ['./turma-form.component.css']
})
export class TurmaFormComponent implements OnInit {

    @ViewChild(FormGroupDirective) form: FormGroupDirective;

    //status: SelectItem[];
    status: Status[];
    root: FormGroup;
    competenciaColaboradorForm: FormGroup;
    acaoAtual: string;
    submittingForm: boolean = false;

    competencias: CompetenciaModel[] = [
        { id: 1, nome: 'Spring', categoria: null },
        { id: 2, nome: 'Angular', categoria: null },
        { id: 3, nome: 'Git', categoria: null },
        { id: 4, nome: 'Postgres', categoria: null }
    ];

    colaboradores: ColaboradorModel[] = [
        { id: 1, nome: 'Vinicius', sobrenome: 'M' },
        { id: 2, nome: 'Fulano', sobrenome: 'Silva' },
        { id: 3, nome: 'Ciclano', sobrenome: null }
    ];

    constructor(
        private turmaService: TurmaService,
        private statusService: StatusService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.setAcaoAtual();
        this.buscarStatus();
        this.criarForm();
        this.criarFormCompetenciaColaborador();
        this.route.paramMap.subscribe(
            params => {
                const id = params.get("id");
                if (id === 'criar') {
                    this.root.setValue({
                        id: null,
                        nome: null,
                        descricao: null,
                        dataInicio: null,
                        dataTermino: null,
                        status: null,
                        competenciasColaboradores: []
                    });
                    this.root.markAsPristine();
                    this.root.markAsUntouched();
                } else {
                    this.turmaService.getById(+id).subscribe(
                        turma => {
                            turma.dataInicio = new Date(turma.dataInicio);
                            turma.dataTermino = new Date(turma.dataTermino);
                            this.root.patchValue(turma);
                            this.root.markAsPristine();
                            this.root.markAsUntouched();
                        }
                    )
                }
            }
        )
    }

    protected criarForm() {
        this.root = new FormGroup({
            id: new FormControl(),
            nome: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            descricao: new FormControl(null, [Validators.required, Validators.minLength(10)]),
            dataInicio: new FormControl(null, [Validators.required]),
            dataTermino: new FormControl(null, [Validators.required]),
            status: new FormControl(null),
            competenciasColaboradores: new FormControl(null)
        });
    }

    private criarFormCompetenciaColaborador() {
        this.competenciaColaboradorForm = new FormGroup({
            competencia: new FormControl(null),
            colaborador: new FormControl(null)
        });
    }

    submitForm() {
        this.submittingForm = true;
        if (!this.root.get('id').value) {
            this.criarTurma();
        } else {
            this.atualizarTurma();
        }
    }

    criarTurma() {
        const turma: Turma = this.root.value
        const turmaDtoInput: TurmaDtoInput = {
            nome: turma.nome,
            descricao: turma.descricao,
            dataInicio: turma.dataInicio,
            dataTermino: turma.dataTermino,
            statusId: turma.status.id,
            competenciasColaboradores: turma.competenciasColaboradores.map(
                cc => ({
                    competenciaId: cc.competencia.id,
                    colaboradorId: cc.colaborador.id
                })
            )
        }
        this.turmaService.save(turmaDtoInput).subscribe(t => {
            this.root.markAsPristine();
            this.root.markAsUntouched();
            this.submittingForm = false;
            this.irParaTurmaList();
        });
    }

    atualizarTurma() {
        const turma: Turma = this.root.value
        const turmaDtoInput: TurmaDtoInput = {
            nome: turma.nome,
            descricao: turma.descricao,
            dataInicio: turma.dataInicio,
            dataTermino: turma.dataTermino,
            statusId: turma.status.id,
            competenciasColaboradores: turma.competenciasColaboradores.map(
                cc => ({
                    competenciaId: cc.competencia.id,
                    colaboradorId: cc.colaborador.id
                })
            )
        }
        this.turmaService.update(turma.id, turmaDtoInput).subscribe(t => {
            this.root.markAsPristine();
            this.root.markAsUntouched();
            this.submittingForm = false;
            this.irParaTurmaList();
        });
    }

    buscarStatus() {
        //return this.statusService.listarStatus().subscribe(s => {
        //this.status = s.map(status => ({ value: s, label: status.descricao }))
        //});
        return this.statusService.listarStatus().subscribe(s =>
            this.status = s);
    }

    setAcaoAtual() {
        if (this.route.snapshot.url[0].path == 'criar') {
            this.acaoAtual = 'criar';
        } else {
            this.acaoAtual = 'editar';
        }
    }

    irParaTurmaList() {
        this.router.navigate(['/turmas'], { relativeTo: this.route });
    }

    deveMostrarMensagemDeErro(control: AbstractControl): boolean {
        return control.errors && control.touched || control.dirty;
    }

    mensagemDeErro(control: AbstractControl) {
        if (control.hasError('required')) {
            return 'Campo obrigatório.'
        }
        if (control.hasError('minlength')) {
            return `O tamanho minímo é de ${control.getError('minlength').requiredLength} caracteres.`;
        }
        return ''
    }

    adicionarCompetenciaColaborador() {
        if (this.competenciaColaboradorForm.get('colaborador').value == null || this.competenciaColaboradorForm.get('competencia').value == null) {
            return console.log('deu ruim');
        }
        const ccForm: CompetenciaColaborador = this.competenciaColaboradorForm.value;
        let colaboradores: CompetenciaColaborador[] = this.root.get('competenciasColaboradores').value;

        if (colaboradores.some(c=> c.colaborador.id == ccForm.colaborador.id && c.competencia.id == ccForm.competencia.id)){
            console.log("Este colaborador já está cadastrado para esta competência")
            return;
        }

        colaboradores = [...colaboradores, ccForm];

        this.root.get('competenciasColaboradores').setValue(colaboradores);
        this.competenciaColaboradorForm.setValue({
            colaborador: null,
            competencia: null
        })
    }

    excluirItem(indexRow: number){
        let colaboradores: CompetenciaColaborador[] = [...this.root.get('competenciasColaboradores').value];
        colaboradores.splice(indexRow, 1);
        this.root.get('competenciasColaboradores').setValue(colaboradores);
    }
}