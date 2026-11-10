# Java

Prácticas de la materia Java de la tecnicatura: desde CRUD por consola con JDBC hasta una API REST con frontend web. Dictadas por los tutores Matías Carballo ([GitHub](https://github.com/lokywolf2295)) y Ariel Betancud ([GitHub](https://github.com/ArielBetancud22)); el planificador se basa en el repositorio [ToDo_Front_-_API](https://github.com/lokywolf2295/ToDo_Front_-_API) de Matías Carballo.

## Índice de proyectos

| Carpeta | Tema | Proyecto |
| ------- | ---- | -------- |
| [Clase 1](Clase%201/) | CRUD por consola con JDBC puro | [estudiante](Clase%201/estudiante/) |
| [Leccion01](Leccion01/) | CRUD por consola con Spring Data JPA | [estudiantes](Leccion01/estudiantes/) |
| [Leccion03](Leccion03/) | CRUD con ventana Swing | [tienda_libros](Leccion03/tienda_libros/) |
| [Clase10-12](Clase10-12/) | API REST por capas + frontend web | [planificador_tareas](Clase10-12/planificador_tareas/) |

## Clase 1 — Sistema de Estudiantes (JDBC)

CRUD de estudiantes por consola contra MySQL, sin frameworks: la conexión y las consultas se manejan a mano con JDBC.

- [SistemaEstudianteApp.java](Clase%201/estudiante/src/main/java/UTN/presentacion/SistemaEstudianteApp.java) — menú por consola y ejecución de opciones
- [Estudiante.java](Clase%201/estudiante/src/main/java/UTN/dominio/Estudiante.java) — entidad de dominio
- [EstudianteDAO.java](Clase%201/estudiante/src/main/java/UTN/datos/EstudianteDAO.java) — acceso a datos con JDBC
- [Conexion.java](Clase%201/estudiante/src/main/java/UTN/conexion/Conexion.java) — conexión a la base de datos

## Leccion01 — Estudiantes (Spring Data JPA)

El mismo CRUD de estudiantes por consola, ahora con Spring Boot: el menú corre con `CommandLineRunner` y el acceso a datos pasa a Spring Data JPA.

- [EstudiantesApplication.java](Leccion01/estudiantes/src/main/java/utn/estudiantes/EstudiantesApplication.java) — main y menú por consola
- [Estudiantes2022.java](Leccion01/estudiantes/src/main/java/utn/estudiantes/modelo/Estudiantes2022.java) — entidad
- [EstudianteRepositorio.java](Leccion01/estudiantes/src/main/java/utn/estudiantes/repositorio/EstudianteRepositorio.java) — repositorio Spring Data JPA
- [IEstudianteServicio.java](Leccion01/estudiantes/src/main/java/utn/estudiantes/servicio/IEstudianteServicio.java) — contrato del servicio
- [EstudianteServicio.java](Leccion01/estudiantes/src/main/java/utn/estudiantes/servicio/EstudianteServicio.java) — implementación

## Leccion03 — Tienda de Libros (Swing)

CRUD de libros con ventana Swing levantada desde el contexto de Spring y Spring Data JPA en la capa de datos.

- [TiendaLibrosApplication.java](Leccion03/tienda_libros/src/main/java/utn/tienda_libros/TiendaLibrosApplication.java) — main que abre la ventana desde Spring
- [LibroFrom.java](Leccion03/tienda_libros/src/main/java/utn/tienda_libros/vista/LibroFrom.java) — formulario Swing
- [Libro.java](Leccion03/tienda_libros/src/main/java/utn/tienda_libros/modelo/Libro.java) — entidad
- [LibroRepositorio.java](Leccion03/tienda_libros/src/main/java/utn/tienda_libros/repositorio/LibroRepositorio.java) — repositorio
- [ILibroServicio.java](Leccion03/tienda_libros/src/main/java/utn/tienda_libros/servicio/ILibroServicio.java) — interfaz del servicio
- [LibroServicio.java](Leccion03/tienda_libros/src/main/java/utn/tienda_libros/servicio/LibroServicio.java) — implementación

## Clase10-12 — Planificador de Tareas (API REST + web)

Full-stack: backend REST por capas (controller → service → repository) con DTOs, excepciones, CORS y Swagger, base MySQL y frontend en HTML/CSS/JS. El detalle completo vive en su [README propio](Clase10-12/planificador_tareas/README.md).

- [PlanificadorApplication.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/PlanificadorApplication.java) — clase principal de Spring Boot
- [Tarea.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/model/Tarea.java) — entidad con builder
- [Prioridad.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/model/Prioridad.java) — enum de prioridades
- [TareaRequest.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/dto/TareaRequest.java) / [TareaResponse.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/dto/TareaResponse.java) — DTOs de entrada y salida
- [TareaRepository.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/repository/TareaRepository.java) — repositorio Spring Data JPA
- [TareaService.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/service/TareaService.java) — reglas de negocio
- [TareaController.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/controller/TareaController.java) — endpoints REST
- [GlobalExceptionHandler.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/exception/GlobalExceptionHandler.java) / [TareaNoEncontradaException.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/exception/TareaNoEncontradaException.java) — manejo de errores
- [CorsConfig.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/config/CorsConfig.java) / [OpenApiConfig.java](Clase10-12/planificador_tareas/backend/src/main/java/com/tareas/planificador/config/OpenApiConfig.java) — CORS y documentación
- [TareaServiceTest.java](Clase10-12/planificador_tareas/backend/src/test/java/com/tareas/planificador/service/TareaServiceTest.java) / [TareaControllerTest.java](Clase10-12/planificador_tareas/backend/src/test/java/com/tareas/planificador/controller/TareaControllerTest.java) / [TareaRepositoryTest.java](Clase10-12/planificador_tareas/backend/src/test/java/com/tareas/planificador/repository/TareaRepositoryTest.java) — pruebas
