package com.tareas.planificador.exception;

public class TareaNoEncontradaException extends RuntimeException {

    public TareaNoEncontradaException(Long id) {
        super("No existe una tarea con id " + id);
    }
}
