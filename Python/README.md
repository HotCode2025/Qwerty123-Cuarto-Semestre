# Python

Prácticas de Python de la tecnicatura: desde los fundamentos del lenguaje y los entornos profesionales hasta un CRUD con DAO y MySQL, APIs con FastAPI, Docker y juegos con Pygame. Dictadas por el tutor Ariel Betancud ([GitHub](https://github.com/ArielBetancud22)).

## Índice

| Carpeta | Tema |
| ------- | ---- |
| [Clase01](Clase01/) | Fundamentos: tipos, strings y formato |
| [Clase03_Python_Entorno_Profesional](Clase03_Python_Entorno_Profesional/) | Entorno profesional e introducción a matplotlib |
| [Clase04_Entorno_Profesional](Clase04_Entorno_Profesional/) | Juego de consola: piedra, papel o tijera |
| [Clase05_Entorno_Profesional](Clase05_Entorno_Profesional/) | Población mundial con gráficos y Docker |
| [Leccion07](Leccion07/) | CRUD de usuarios con patrón DAO y PostgreSQL |
| [Clase8_Entorno_Profesional](Clase8_Entorno_Profesional/) | FastAPI, Docker y flujo de git |
| [Clase9_Entorno_Profesional](Clase9_Entorno_Profesional/) | Population API con FastAPI y Docker |
| [Juego_Tecnicatura](Juego_Tecnicatura/) | Juego espacial con Pygame |

## Clase01 — Fundamentos de Python

Ejercicios sueltos sobre tipos de datos, strings y formateo.

- Tipos y valores: [tipo_str.py](Clase01/tipo_str.py) · [tipo_bool.py](Clase01/tipo_bool.py) · [tipo_float.py](Clase01/tipo_float.py) · [tipo_nan.py](Clase01/tipo_nan.py) · [valores_infinitos.py](Clase01/valores_infinitos.py) · [Sistema_numeracion.py](Clase01/Sistema_numeracion.py)
- Strings y formato: [f_string.py](Clase01/f_string.py) · [dar_formato_str.py](Clase01/dar_formato_str.py) · [doc_str.py](Clase01/doc_str.py) · [metodo_split.py](Clase01/metodo_split.py) · [metodo_join.py](Clase01/metodo_join.py) · [str_inmutable.py](Clase01/str_inmutable.py)
- Clases: [mi_clase.py](Clase01/mi_clase.py)

## Clase03_Python_Entorno_Profesional — Entorno profesional

Registro de comandos de instalación de Python y pip, más un primer proyecto con matplotlib dentro de `Python_avanzado`.

- [README.md](Clase03_Python_Entorno_Profesional/README.md) — comandos y dependencias
- [Python_avanzado/charts/main.py](Clase03_Python_Entorno_Profesional/Python_avanzado/charts/main.py) · [charts/charts.py](Clase03_Python_Entorno_Profesional/Python_avanzado/charts/charts.py) — gráfico de torta con matplotlib

## Clase04_Entorno_Profesional — Piedra, papel o tijera

Juego de consola contra la computadora.

- [README.md](Clase04_Entorno_Profesional/README.md) — cómo ejecutarlo
- [game/main.py](Clase04_Entorno_Profesional/game/main.py) — lógica del juego

## Clase05_Entorno_Profesional — Población mundial con gráficos

Script que lee `data.csv`, filtra por continente y genera gráficos de torta y barras con matplotlib; incluye Docker.

- [app/main.py](Clase05_Entorno_Profesional/app/main.py) — flujo principal
- [app/read_csv.py](Clase05_Entorno_Profesional/app/read_csv.py) · [app/utils.py](Clase05_Entorno_Profesional/app/utils.py) · [app/charts.py](Clase05_Entorno_Profesional/app/charts.py) — lectura, filtros y gráficos
- [app/README-DOCKER.md](Clase05_Entorno_Profesional/app/README-DOCKER.md) — ejecución con Docker

## Leccion07 — CRUD de usuarios con DAO y PostgreSQL

Aplicación de consola para administrar usuarios con patrón DAO sobre PostgreSQL, pool de conexiones y logging.

- [main.py](Leccion07/main.py) — punto de entrada
- [menu_app_usuario.py](Leccion07/menu_app_usuario.py) — menú e interacción
- [usuario_dao.py](Leccion07/usuario_dao.py) — DAO de usuarios
- [Clase_entidad_Usuario.py](Leccion07/Clase_entidad_Usuario.py) — entidad
- [conexion.py](Leccion07/conexion.py) · [cursor_del_pool.py](Leccion07/cursor_del_pool.py) · [logger_base.py](Leccion07/logger_base.py) — conexión, pool y logging

## Clase8_Entorno_Profesional — FastAPI, Docker y git

Servidor web mínimo con FastAPI (rutas y consumo de una API externa), Docker y documentación del flujo de trabajo con git.

- [README.md](Clase8_Entorno_Profesional/README.md) · [TEORIA.md](Clase8_Entorno_Profesional/TEORIA.md) · [Bitacora.md](Clase8_Entorno_Profesional/Bitacora.md) — teoría y bitácora
- [web-server/main.py](Clase8_Entorno_Profesional/web-server/main.py) — rutas FastAPI
- [web-server/store.py](Clase8_Entorno_Profesional/web-server/store.py) — consumo de la API de razas de perros
- [README-DOCKER.md](Clase8_Entorno_Profesional/README-DOCKER.md) — ejecución con Docker

## Clase9_Entorno_Profesional — Population API (FastAPI)

Mini API con FastAPI que lee `data.csv`, obtiene la población por país y genera gráficos con matplotlib; se puede correr local o con Docker.

- [app/README.md](Clase9_Entorno_Profesional/app/README.md) — guía de ejecución
- [app/main.py](Clase9_Entorno_Profesional/app/main.py) — API y punto de entrada
- [app/charts.py](Clase9_Entorno_Profesional/app/charts.py) · [app/utils.py](Clase9_Entorno_Profesional/app/utils.py) · [app/read_csv.py](Clase9_Entorno_Profesional/app/read_csv.py) — gráficos, consultas y lectura del CSV
- [app/README-DOCKER.md](Clase9_Entorno_Profesional/app/README-DOCKER.md) — ejecución con Docker

## Juego_Tecnicatura — Juego espacial con Pygame

Juego estilo Star Wars con nave, enemigos, explosiones, puntaje y sonidos.

- [main.py](Juego_Tecnicatura/main.py) — bucle principal y pantalla de inicio
- [personaje.py](Juego_Tecnicatura/personaje.py) — jugador y enemigos
- [explosiones.py](Juego_Tecnicatura/explosiones.py) — animación de explosiones
- [constantes.py](Juego_Tecnicatura/constantes.py) — medidas y rutas de assets
