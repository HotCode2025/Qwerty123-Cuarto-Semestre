package com.tareas.planificador.service;

import com.tareas.planificador.dto.TareaRequest;
import com.tareas.planificador.dto.TareaResponse;
import com.tareas.planificador.exception.TareaNoEncontradaException;
import com.tareas.planificador.model.Prioridad;
import com.tareas.planificador.model.Tarea;
import com.tareas.planificador.repository.TareaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TareaService {

    private final TareaRepository tareaRepository;

    @Transactional
    public TareaResponse crear(TareaRequest request) {
        Tarea tarea = new Tarea();
        copiarDatos(request, tarea);
        return TareaResponse.desde(tareaRepository.save(tarea));
    }

    @Transactional(readOnly = true)
    public List<TareaResponse> listar(Boolean finalizada, Prioridad prioridad) {
        return tareaRepository.buscarConFiltros(finalizada, prioridad).stream()
                .map(TareaResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public TareaResponse obtener(Long id) {
        return TareaResponse.desde(buscarPorId(id));
    }

    @Transactional
    public TareaResponse actualizar(Long id, TareaRequest request) {
        Tarea tarea = buscarPorId(id);
        copiarDatos(request, tarea);
        return TareaResponse.desde(tareaRepository.save(tarea));
    }

    @Transactional
    public TareaResponse marcarFinalizada(Long id, boolean finalizada) {
        Tarea tarea = buscarPorId(id);
        tarea.setFinalizada(finalizada);
        return TareaResponse.desde(tareaRepository.save(tarea));
    }

    @Transactional
    public void eliminar(Long id) {
        // Se busca primero para devolver 404 si no existe, en vez de fallar en silencio
        tareaRepository.delete(buscarPorId(id));
    }

    private Tarea buscarPorId(Long id) {
        return tareaRepository.findById(id)
                .orElseThrow(() -> new TareaNoEncontradaException(id));
    }

    private void copiarDatos(TareaRequest request, Tarea tarea) {
        tarea.setTitulo(request.titulo().trim());
        tarea.setDescripcion(request.descripcion());
        tarea.setFecha(request.fecha());
        tarea.setHora(request.hora());
        tarea.setPrioridad(request.prioridad() != null ? request.prioridad() : Prioridad.MEDIA);
    }
}
