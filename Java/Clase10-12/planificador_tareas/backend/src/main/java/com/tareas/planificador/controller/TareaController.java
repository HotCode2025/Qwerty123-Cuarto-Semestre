package com.tareas.planificador.controller;

import com.tareas.planificador.dto.TareaRequest;
import com.tareas.planificador.dto.TareaResponse;
import com.tareas.planificador.model.Prioridad;
import com.tareas.planificador.service.TareaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tareas")
@RequiredArgsConstructor
@Tag(name = "Tareas", description = "Gestión del planificador de tareas")
public class TareaController {

    private final TareaService tareaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear una tarea")
    public TareaResponse crear(@Valid @RequestBody TareaRequest request) {
        return tareaService.crear(request);
    }

    @GetMapping
    @Operation(summary = "Listar tareas ordenadas por fecha y hora, con filtros opcionales")
    public List<TareaResponse> listar(@RequestParam(required = false) Boolean finalizada,
                                      @RequestParam(required = false) Prioridad prioridad) {
        return tareaService.listar(finalizada, prioridad);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una tarea por id")
    public TareaResponse obtener(@PathVariable Long id) {
        return tareaService.obtener(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar una tarea")
    public TareaResponse actualizar(@PathVariable Long id, @Valid @RequestBody TareaRequest request) {
        return tareaService.actualizar(id, request);
    }

    @PatchMapping("/{id}/finalizada/{valor}")
    @Operation(summary = "Marcar una tarea como finalizada o pendiente")
    public TareaResponse marcarFinalizada(@PathVariable Long id, @PathVariable boolean valor) {
        return tareaService.marcarFinalizada(id, valor);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar una tarea")
    public void eliminar(@PathVariable Long id) {
        tareaService.eliminar(id);
    }
}
