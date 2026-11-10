# Plan de commits, tags y checklist

Proyecto: `Java/Clase10-12/planificador_tareas/` del repositorio `Qwerty123-Cuarto-Semestre` (grupo QWERTY123).
Cada commit es chico y deja el proyecto en un estado que compila. Cada uno corresponde a un issue del repositorio (#265 a #276), agregado al tablero **Qwerty123 - Java** con la etiqueta `planificador`.

## Reglas

- Se trabaja en la rama `respaldo-main`. Antes de empezar un issue: `git switch respaldo-main` y `git pull`. Si el `git push` es rechazado, `git pull` y volver a `git push`.
- Formato del mensaje: `<área>: <qué se hizo> (refs #<número del issue>)`. Áreas: equipo, base de datos, backend, frontend, pruebas y docs. `refs` enlaza el commit con el issue pero no lo cierra.
- Los issues se cierran al hacer el merge a `main` (ver el final de este documento).
- Los tags son del repositorio entero, por eso llevan el prefijo `planificador-`. Se crean sobre el commit del issue ya subido.
- Nunca se suben `.env`, claves ni `target/`.
- Antes de cada commit se corre lo indicado en su checklist y recién ahí se marca la casilla.

> Comandos desde la carpeta del proyecto. Para el backend: `cd backend`.

---

## 1. Backend: proyecto base de Spring Boot — #265 · Gustavo

`backend: proyecto base de Spring Boot con Java 21 y MySQL (refs #265)`

Archivos: `.gitignore`, `backend/pom.xml`, `backend/src/main/resources/application.yml`, `backend/src/main/java/com/tareas/planificador/PlanificadorApplication.java`

- [ ] `git status` no muestra `target/`, `.idea/` ni `.env`
- [ ] `mvn -q compile` termina sin errores
- [ ] `application.yml` usa `${DB_USER}` y `${DB_PASSWORD}`, sin contraseñas escritas
- [ ] El pom usa `springdoc-openapi-starter-webmvc-ui` (no `springdoc-openapi-ui`)

## 2. Base de datos: enum, entidad y repository — #266 · Gustavo

`base de datos: entidad Tarea, enum Prioridad y repository (refs #266)`

Archivos: `model/Prioridad.java`, `model/Tarea.java`, `repository/TareaRepository.java`

- [ ] `mvn -q compile` sin errores
- [ ] Con `DB_USER` y `DB_PASSWORD` definidas, la app arranca y en Workbench aparece la tabla `tareas` en `db_planificador_tareas`

**Tag:** `git tag -a planificador-v0.1.0 -m "Base de datos y modelo"`

## 3. API: DTOs y manejo de errores — #267 · Gabriel

`backend: DTOs y manejo centralizado de errores (refs #267)`

Archivos: `dto/TareaRequest.java`, `dto/TareaResponse.java`, `exception/TareaNoEncontradaException.java`, `exception/GlobalExceptionHandler.java`

- [ ] `mvn -q compile` sin errores
- [ ] `TareaRequest` valida título, fecha y hora obligatorios
- [ ] `TareaResponse.desde()` calcula `vencida` solo para tareas pendientes

## 4. API: TareaService con CRUD, filtros y estado — #268 · Gabriel

`backend: TareaService con CRUD, filtros y estado (refs #268)`

Archivos: `service/TareaService.java`

- [ ] `mvn -q compile` sin errores
- [ ] Sin prioridad en el request, se asigna MEDIA
- [ ] Eliminar o editar un id inexistente lanza `TareaNoEncontradaException`

## 5. API: endpoints REST en TareaController — #269 · Gabriel

`backend: API REST en TareaController (refs #269)`

Archivos: `controller/TareaController.java`

- [ ] La app arranca sin errores
- [ ] `GET http://localhost:8080/api/v1/tareas` responde `[]` con la base vacía
- [ ] `POST` con datos válidos responde 201; sin título responde 400
- [ ] `GET /api/v1/tareas/999` responde 404 con formato JSON uniforme

**Tag:** `git tag -a planificador-v0.2.0 -m "API REST completa"`

## 6. API: CORS y documentación OpenAPI — #270 · Gabriel

`backend: CORS y documentación OpenAPI (refs #270)`

Archivos: `config/CorsConfig.java`, `config/OpenApiConfig.java`

- [ ] `http://localhost:8080/swagger-ui.html` muestra los 6 endpoints
- [ ] Una petición desde `http://localhost:5500` no es bloqueada por CORS (se comprueba de punta a punta en el paso 10)

## 7. Pruebas: tests de service, controller y repository — #271 · Tomás

`pruebas: tests de service, controller y repository (refs #271)`

Archivos: carpeta `backend/src/test/`

- [ ] `mvn test` termina con `Tests run: 11, Failures: 0, Errors: 0`
- [ ] Los tests no necesitan MySQL (usan H2 en memoria)

**Tag:** `git tag -a planificador-v0.3.0 -m "Backend testeado"`

## 8. Pruebas: colección de Postman — #272 · Tomás

`pruebas: colección de Postman para la API (refs #272)`

Archivos: `postman/Planificador.postman_collection.json`

- [ ] La colección se importa en Postman sin errores
- [ ] Con el backend corriendo, _Run collection_ pasa todos los tests en orden
- [ ] Incluye los casos de error 400 y 404

## 9. Frontend: estructura HTML y estilos CSS — #273 · Agustín

`frontend: estructura HTML y estilos CSS (refs #273)`

Archivos: `frontend/index.html`, `frontend/css/styles.css`

- [ ] Se abre con Live Server y se ven los indicadores, el formulario, los filtros y la tarjeta _Tareas_
- [ ] Se ve bien en ancho de celular (modo responsive del navegador)

> Nota: hasta el paso 10 el HTML carga un `script.js` que todavía no existe (aparece un 404 en la consola; es esperado).

## 10. Frontend: conectar el front con la API — #274 · Agustín

`frontend: conectar con la API (crear, listar, editar, filtrar, completar y eliminar) (refs #274)`

Archivos: `frontend/js/script.js`

- [ ] Con backend y Live Server corriendo, se puede crear una tarea y aparece en la lista
- [ ] Marcar el check la completa y actualiza los indicadores
- [ ] Editar y eliminar funcionan (con confirmación)
- [ ] Una tarea con fecha pasada se ve marcada como vencida
- [ ] Los filtros por estado y prioridad funcionan, y _Limpiar filtros_ los reinicia
- [ ] El tema elegido se mantiene al recargar
- [ ] Con el backend apagado se muestra un mensaje de error claro, sin romper la página

**Tag:** `git tag -a planificador-v0.4.0 -m "Front completo"`

## 11. Documentación: README y plan de commits — #275 · Tomás

`docs: README con capturas, instalación, API y agradecimientos (refs #275)`

Archivos: `README.md`, `docs/PLAN_COMMITS.md` y la carpeta `docs/capturas/` con `planificador-claro.png`, `planificador-oscuro.png`, `movil-formulario.png` y `movil-tareas.png`

- [ ] Los pasos del README funcionan en una máquina limpia (clonar, pasar a `respaldo-main`, definir variables, correr)
- [ ] Los enlaces y rutas del README son correctos
- [ ] Las 4 imágenes están en `docs/capturas/` con los nombres exactos que usa el README (GitHub distingue mayúsculas y minúsculas)
- [ ] `git status` muestra las 4 imágenes como archivos nuevos (si no aparecen, revisar que `.gitignore` no excluya `*.png`)
- [ ] En la vista previa del README (`Ctrl+Shift+V` en VS Code) se ven las capturas de la sección _Capturas_

## 12. Prueba de punta a punta y versión final — #276 · los cuatro

No sube archivos: el resultado se deja como comentario en el issue.

**Tag:** `git tag -a planificador-v1.1.0 -m "Versión final del planificador de tareas"` (lo crea Gustavo)

---

## Subir los tags

Solo los de este proyecto (no se usa `--tags`, que subiría todos los del repositorio):

```bash
git push origin planificador-v0.1.0 planificador-v0.2.0 planificador-v0.3.0 planificador-v0.4.0 planificador-v1.1.0
```

## Verificación final (antes del tag planificador-v1.1.0)

- [ ] `mvn test` en verde (11 tests)
- [ ] La app arranca con MySQL real y el front funciona de punta a punta
- [ ] La colección de Postman pasa completa
- [ ] Los issues #265 a #275 están terminados
- [ ] `git status` limpio y ningún secreto en el historial de la carpeta (`git log -p -- Java/Clase10-12/planificador_tareas | grep -i password`)

## Merge a main

Con todo probado y el tag `planificador-v1.1.0` subido:

1. Abrir un pull request de `respaldo-main` a `main`.
2. En la descripción, escribir: `Closes #265, closes #266, closes #267, closes #268, closes #269, closes #270, closes #271, closes #272, closes #273, closes #274, closes #275, closes #276`.
3. Hacer el merge como **merge commit** (no _squash_), para que los tags sigan apuntando a commits que están en `main`.
