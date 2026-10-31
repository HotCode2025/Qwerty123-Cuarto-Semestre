package com.tareas.planificador.repository;

import com.tareas.planificador.model.Prioridad;
import com.tareas.planificador.model.Tarea;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

// @DataJpaTest reemplaza el MySQL por H2 en memoria automáticamente
@DataJpaTest
class TareaRepositoryTest {

    @Autowired
    private TareaRepository tareaRepository;

    private Tarea nueva(String titulo, LocalDate fecha, Prioridad prioridad, boolean finalizada) {
        return Tarea.builder().titulo(titulo).fecha(fecha).hora(LocalTime.of(9, 0))
                .prioridad(prioridad).finalizada(finalizada).build();
    }

    @Test
    void ordenaPorFechaYAplicaFiltros() {
        tareaRepository.save(nueva("B", LocalDate.of(2030, 1, 2), Prioridad.ALTA, false));
        tareaRepository.save(nueva("A", LocalDate.of(2030, 1, 1), Prioridad.BAJA, true));

        List<Tarea> todas = tareaRepository.buscarConFiltros(null, null);
        assertEquals("A", todas.get(0).getTitulo());

        assertEquals(1, tareaRepository.buscarConFiltros(true, null).size());
        assertEquals("B", tareaRepository.buscarConFiltros(null, Prioridad.ALTA).get(0).getTitulo());
    }
}
