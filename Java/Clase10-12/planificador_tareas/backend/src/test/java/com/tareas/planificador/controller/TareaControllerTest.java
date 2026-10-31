package com.tareas.planificador.controller;

import com.tareas.planificador.dto.TareaResponse;
import com.tareas.planificador.exception.TareaNoEncontradaException;
import com.tareas.planificador.model.Prioridad;
import com.tareas.planificador.service.TareaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TareaController.class)
class TareaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TareaService tareaService;

    @Test
    void crearTareaValidaDevuelve201() throws Exception {
        TareaResponse respuesta = new TareaResponse(1L, "Estudiar", null,
                LocalDate.of(2030, 1, 1), LocalTime.of(10, 0), Prioridad.ALTA, false, false);
        when(tareaService.crear(any())).thenReturn(respuesta);

        mockMvc.perform(post("/api/v1/tareas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"titulo":"Estudiar","fecha":"2030-01-01","hora":"10:00","prioridad":"ALTA"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.prioridad").value("ALTA"));
    }

    @Test
    void crearSinTituloDevuelve400() throws Exception {
        mockMvc.perform(post("/api/v1/tareas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"titulo":"","fecha":"2030-01-01","hora":"10:00"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensajes[0]").exists());
    }

    @Test
    void obtenerInexistenteDevuelve404() throws Exception {
        when(tareaService.obtener(99L)).thenThrow(new TareaNoEncontradaException(99L));

        mockMvc.perform(get("/api/v1/tareas/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.estado").value(404));
    }

    @Test
    void prioridadInvalidaEnFiltroDevuelve400() throws Exception {
        mockMvc.perform(get("/api/v1/tareas?prioridad=URGENTE"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void eliminarDevuelve204() throws Exception {
        mockMvc.perform(delete("/api/v1/tareas/1"))
                .andExpect(status().isNoContent());
    }
}
