package com.basis.sgcproject.resource;


import com.basis.sgcproject.service.ColaboradorService;
import com.basis.sgcproject.service.dto.ColaboradorCompetenciaListNivelDTO;
import com.basis.sgcproject.service.dto.ColaboradorDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/colaboradores")
@RequiredArgsConstructor
public class ColaboradorResource {

    private final ColaboradorService service;

    @GetMapping
    public ResponseEntity<List<ColaboradorDTO>> obterTodos() {
        return ResponseEntity.ok(service.obterTodos());
    }

    @PostMapping
    public ResponseEntity<ColaboradorDTO> salvar(@Valid @RequestBody ColaboradorDTO colaboradorDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(colaboradorDTO));

    }

    @GetMapping("/{id}")
    public ResponseEntity<ColaboradorDTO> obterPorId(@Valid @PathVariable("id")Integer id){
        return ResponseEntity.ok(service.obterPorId(id));
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable("id")Integer id){
            service.deletar(id);
    }


    @PutMapping
    public ResponseEntity<ColaboradorDTO> editar(@Valid @RequestBody  ColaboradorDTO colaboradorDTO){
        return ResponseEntity.ok(service.salvar(colaboradorDTO));
    }

    @GetMapping("/competencia/{idCompetencia}")
    public ResponseEntity<List<ColaboradorDTO>> obterListaColaboradorPorCompetencia(@PathVariable("idCompetencia") Integer idCompetencia) {
        return ResponseEntity.ok(service.findAllColaboradorPorCompetencia(idCompetencia));
    }

    @GetMapping("/Nivel")
    public ResponseEntity<List<ColaboradorCompetenciaListNivelDTO>> obterListaColaboradorPorCompetenciaNivel() {
        return ResponseEntity.ok(service.buscarColaboradorCompetenciaNivel());
    }


}