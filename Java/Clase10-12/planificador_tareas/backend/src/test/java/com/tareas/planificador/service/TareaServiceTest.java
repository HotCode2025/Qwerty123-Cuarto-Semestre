package com.tareas.planificador.service;

import com.tareas.planificador.dto.TareaRequest;
import com.tareas.planificador.dto.TareaResponse;
import com.tareas.planificador.exception.TareaNoEncontradaException;
import com.tareas.planificador.model.Prioridad;
import com.tareas.planificador.model.Tarea;
import com.tareas.planificador.repository.TareaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TareaServiceTest {

    @Mock
    private TareaRepository tareaRepository;

    @InjectMocks
    private TareaService tareaService;

    @Test
    void crearSinPrioridadAsumeMedia() {
        TareaRequest request = new TareaRequest("Estudiar", null,
                LocalDate.now().plusDays(1), LocalTime.of(10, 0), null);
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(inv -> inv.getArgument(0));

        TareaResponse respuesta = tareaService.crear(request);

        assertEquals(Prioridad.MEDIA, respuesta.prioridad());
        assertFalse(respuesta.finalizada());
    }

    @Test
    void tareaPasadaYPendienteEstaVencida() {
        Tarea tarea = Tarea.builder().id(1L).titulo("Vieja").fecha(LocalDate.now().minusDays(1))
                .hora(LocalTime.of(8, 0)).prioridad(Prioridad.ALTA).finalizada(false).build();
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tarea));

        assertTrue(tareaService.obtener(1L).vencida());
    }

    @Test
    void tareaPasadaPeroFinalizadaNoEstaVencida() {
        Tarea tarea = Tarea.builder().id(1L).titulo("Vieja").fecha(LocalDate.now().minusDays(1))
                .hora(LocalTime.of(8, 0)).prioridad(Prioridad.ALTA).finalizada(true).build();
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tarea));

        assertFalse(tareaService.obtener(1L).vencida());
    }

    @Test
    void marcarFinalizadaCambiaElEstado() {
        Tarea tarea = Tarea.builder().id(1L).titulo("Tarea").fecha(LocalDate.now().plusDays(1))
                .hora(LocalTime.of(9, 0)).prioridad(Prioridad.BAJA).finalizada(false).build();
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tarea));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(inv -> inv.getArgument(0));

        assertTrue(tareaService.marcarFinalizada(1L, true).finalizada());
    }

    @Test
    void eliminarInexistenteLanzaExcepcion() {
        when(tareaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(TareaNoEncontradaException.class, () -> tareaService.eliminar(99L));
        verify(tareaRepository, never()).delete(any());
    }
}
