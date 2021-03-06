package com.basis.sgcproject.service.dto.input;

import com.basis.sgcproject.service.dto.StatusDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class TurmaFormacaoDtoInput {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;
    @NotNull
    private LocalDateTime dataInicio;
    @NotNull
    private LocalDateTime dataTermino;
    @NotNull
    private Integer statusId;
    @Valid
    @NotEmpty(message = "Obrigatório informar ao menos uma compentência")
    private Set<CompetenciaColaboradorDtoIdInput> competenciasColaboradores = new HashSet<>();
}
