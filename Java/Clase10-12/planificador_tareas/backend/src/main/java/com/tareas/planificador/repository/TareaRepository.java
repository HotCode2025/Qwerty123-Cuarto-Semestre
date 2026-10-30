package com.tareas.planificador.repository;

import com.tareas.planificador.model.Prioridad;
import com.tareas.planificador.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // Los filtros son opcionales: si llegan null, esa condición no se aplica
    @Query("""
            SELECT t FROM Tarea t
            WHERE (:finalizada IS NULL OR t.finalizada = :finalizada)
              AND (:prioridad IS NULL OR t.prioridad = :prioridad)
            ORDER BY t.fecha ASC, t.hora ASC
            """)
    List<Tarea> buscarConFiltros(@Param("finalizada") Boolean finalizada,
                                 @Param("prioridad") Prioridad prioridad);
}
