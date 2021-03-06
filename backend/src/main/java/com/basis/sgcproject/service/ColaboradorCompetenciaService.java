package com.basis.sgcproject.service;

import com.basis.sgcproject.domain.Colaborador;
import com.basis.sgcproject.domain.ColaboradorCompetencia;
import com.basis.sgcproject.repository.ColaboradorCompetenciaRepository;
import com.basis.sgcproject.service.dto.ColaboradorCompetenciaListNivelDTO;
import com.basis.sgcproject.service.dto.ColaboradorCompetenciaNivelDTO;
import com.basis.sgcproject.service.mapper.ColaboradorCompetenciaMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class ColaboradorCompetenciaService {

    private final ColaboradorCompetenciaRepository colaboradorCompetenciaRepository;
    private final ColaboradorCompetenciaMapper colaboradorCompetenciaMapper;


    public List<ColaboradorCompetenciaListNivelDTO> buscar(){
        List<ColaboradorCompetencia> competencia = colaboradorCompetenciaRepository.findAll();
        return colaboradorCompetenciaMapper.toDto(competencia);

    }

    public ColaboradorCompetenciaListNivelDTO salvar(ColaboradorCompetenciaNivelDTO dto){
        ColaboradorCompetencia colaboradorCompetencia = colaboradorCompetenciaMapper.toEntity(dto);
        return colaboradorCompetenciaMapper.toDto(colaboradorCompetenciaRepository.save(colaboradorCompetencia));
    }

    public void removerCompetenciasColaborador(Integer colaboradorId){
        colaboradorCompetenciaRepository.flush();
        List<ColaboradorCompetencia> lista = colaboradorCompetenciaRepository.buscarPorId(colaboradorId);
        if (lista.isEmpty()){
            return;
        }
        lista.forEach(colaboradorCompetenciaRepository::delete);
    }

    public List<ColaboradorCompetenciaListNivelDTO> buscarColaboradorCompetenciaMaiorNivel(){
       return colaboradorCompetenciaMapper.toDto(colaboradorCompetenciaRepository.buscarColaboradorCompetenciaNivel());
    }

    public void salvar(Colaborador colaborador, List<ColaboradorCompetenciaListNivelDTO> competencias) {
        List<ColaboradorCompetencia> competencias1 = colaboradorCompetenciaMapper.toEntity(competencias);
        competencias1.forEach(colaboradorCompetencia -> {
            colaboradorCompetencia.getId().setIdColaborador(colaborador.getId());
            colaboradorCompetencia.setColaborador(colaborador);
        });
        colaboradorCompetenciaRepository.saveAll(competencias1);
    }

    public void removerCompetenciasColaborador(Integer idColaborador, Integer idCompetencia) {
        colaboradorCompetenciaRepository.deleteByColaboradorIdAndCompetenciaId(idColaborador, idCompetencia);
    }
}