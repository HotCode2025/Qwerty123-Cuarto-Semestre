package com.tareas.planificador.dto;

import com.tareas.planificador.model.Prioridad;
import com.tareas.planificador.model.Tarea;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record TareaResponse(
        Long id,
        String titulo,
        String descripcion,
        LocalDate fecha,
        LocalTime hora,
        Prioridad prioridad,
        boolean finalizada,
        boolean vencida
) {

    public static TareaResponse desde(Tarea tarea) {
        // Una tarea está vencida si ya pasó su fecha y hora y todavía no se completó
        boolean vencida = !tarea.isFinalizada()
                && LocalDateTime.of(tarea.getFecha(), tarea.getHora()).isBefore(LocalDateTime.now());

        return new TareaResponse(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getFecha(),
                tarea.getHora(),
                tarea.getPrioridad(),
                tarea.isFinalizada(),
                vencida
        );
    }
}
