import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColaboradorModel } from '../model/colaborador.model';
import { CompetenciaColaboradorNivelMaxino } from '../../turma/model/competencia-colaborador-nivel-maximo.model';


const baseUrl = '/api/colaboradores';

@Injectable({
  providedIn: 'root'
})

export class ColaboradorService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<any> {
    return this.http.get(baseUrl);
  }

  save(colaborador: ColaboradorModel): Observable<ColaboradorModel> {
    return this.http.post<ColaboradorModel>(baseUrl, colaborador);
  }

  buscarColaboradorCompetenciaPorNivelMaximo(): Observable<CompetenciaColaboradorNivelMaxino[]> {
      return this.http.get<CompetenciaColaboradorNivelMaxino[]>(`${baseUrl}/nivel`);
  }

}