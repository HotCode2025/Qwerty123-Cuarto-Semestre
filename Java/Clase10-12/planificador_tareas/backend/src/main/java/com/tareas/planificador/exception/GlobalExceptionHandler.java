package com.tareas.planificador.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// Centraliza los errores para que la API siempre responda con el mismo formato JSON
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TareaNoEncontradaException.class)
    public ResponseEntity<Map<String, Object>> manejarNoEncontrada(TareaNoEncontradaException ex) {
        return respuesta(HttpStatus.NOT_FOUND, List.of(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidacion(MethodArgumentNotValidException ex) {
        List<String> errores = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .toList();
        return respuesta(HttpStatus.BAD_REQUEST, errores);
    }

    // JSON mal formado o con fecha/hora/prioridad inválida
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> manejarJsonInvalido(HttpMessageNotReadableException ex) {
        return respuesta(HttpStatus.BAD_REQUEST,
                List.of("El cuerpo de la petición es inválido. Revisá el formato de fecha (yyyy-MM-dd), hora (HH:mm) y prioridad (ALTA, MEDIA, BAJA)"));
    }

    // Parámetros de URL inválidos, por ejemplo ?prioridad=URGENTE o un id no numérico
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> manejarTipoInvalido(MethodArgumentTypeMismatchException ex) {
        return respuesta(HttpStatus.BAD_REQUEST,
                List.of("Valor inválido para el parámetro '" + ex.getName() + "'"));
    }

    private ResponseEntity<Map<String, Object>> respuesta(HttpStatus estado, List<String> mensajes) {
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("fecha", LocalDateTime.now());
        cuerpo.put("estado", estado.value());
        cuerpo.put("error", estado.getReasonPhrase());
        cuerpo.put("mensajes", mensajes);
        return ResponseEntity.status(estado).body(cuerpo);
    }
}
