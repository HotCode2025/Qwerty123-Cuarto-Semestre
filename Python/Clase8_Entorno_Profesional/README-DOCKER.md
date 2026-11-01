# DOCKER - Clase 8 (web-server)

Esta guia explica como correr la aplicacion **web-server** con Docker, sin
instalar Python en la computadora.

La aplicacion es una API hecha con **FastAPI** que expone una lista, una pagina
HTML y su documentacion interactiva.

Si queres correrla directamente con Python, mira [README.md](README.md).

## Que es Docker

Docker funciona con el concepto de contenedores. Imaginate que tu aplicacion
necesita Python, ciertas librerias y una configuracion especifica para
funcionar. En vez de instalar todo eso en tu PC, Docker crea una cajita aislada
que tiene exactamente lo que necesita, nada mas.

Los componentes principales:

- **Imagen** → es la receta. Describe que tiene que tener el contenedor (sistema
  operativo, programas, archivos). Se define en un `Dockerfile`.
- **Contenedor** → es la receta ejecutandose. Cuando corrés una imagen, se crea
  un contenedor: la aplicacion corriendo en esa cajita aislada.
- **Docker Compose** → cuando necesitás varios contenedores juntos (por ejemplo
  uno con Python y otro con MySQL), el `docker-compose.yml` los define y levanta
  todos de una con `docker compose up`.

## Instalacion en Windows

1. Activar la virtualizacion en la BIOS si esta desactivada.
2. Instalar **WSL 2** (Subsistema de Windows para Linux).
3. Instalar **Docker Desktop**.

Verificar que quedo bien instalado:

```powershell
docker --version
docker compose version
```

Si `docker` no se reconoce, cerrar y abrir la terminal (o reiniciar Windows)
para que tome el `PATH` actualizado. Docker Desktop tambien tiene que estar
**abierto y corriendo**.

## Archivos del proyecto

### `Dockerfile`

Contiene las instrucciones para construir la imagen:

- Parte de `python:3.12-slim`.
- Instala las dependencias de `requirements.txt`.
- Copia el codigo del proyecto.
- Arranca la API con `uvicorn` en el puerto `80` del contenedor.

### `docker-compose.yml`

Define el servicio `web-server`:

- Construye la imagen usando el `Dockerfile`.
- Publica el puerto `8001` de tu PC hacia el puerto `80` del contenedor.
- Tiene un `healthcheck` que verifica `GET /`.

### `.dockerignore`

Lista los archivos que **no** se copian a la imagen (entorno virtual, cache de
Python, etc.). Asi la imagen es mas chica y el build mas rapido.

## Importante: el puerto es 8001

Dentro del contenedor la aplicacion escucha en el puerto **80**, pero en tu PC
se publica en el puerto **8001**:

```text
http://localhost:8001  ->  contenedor:80
```

Se eligio `8001` porque la aplicacion de **Clase9** ya usa el puerto `8000`.
Asi las dos pueden estar levantadas al mismo tiempo sin chocar.

| Proyecto | URL local |
| --- | --- |
| Clase8 - web-server | http://localhost:8001 |
| Clase9 - Population API | http://localhost:8000 |

Si queres usar otro puerto, cambia el mapeo en `docker-compose.yml`:

```yaml
ports:
  - "8001:80"   # http://localhost:8001
  # - "8000:80" # http://localhost:8000 (solo si Clase9 esta apagada)
  # - "80:80"   # http://localhost
```

Despues de cambiarlo, volve a levantar el contenedor:

```powershell
docker compose up -d
```

El numero de la izquierda es el puerto de tu PC; el de la derecha es el puerto
interno del contenedor y **no se cambia**.

## Como levantar el proyecto con Docker

Siempre desde la carpeta `web-server`, donde esta el `docker-compose.yml`:

```powershell
cd .\Python\Clase8_Entorno_Profesional\web-server

# 1. Construir la imagen y levantar el contenedor
docker compose up -d --build

# 2. Ver que este corriendo y sano
docker compose ps
```

En `docker compose ps` el estado tiene que figurar como `Up (healthy)`.

Abrir en el navegador:

- **Lista:** http://localhost:8001/
- **Pagina HTML:** http://localhost:8001/contact
- **Documentacion interactiva:** http://localhost:8001/docs
- **Estado del servicio (healthcheck):** http://localhost:8001/

## Endpoints

| Metodo | Ruta | Que devuelve |
| --- | --- | --- |
| GET | `/` | La lista `[1, 2, 3]`. |
| GET | `/contact` | Una pagina HTML de ejemplo. |
| GET | `/docs` | Documentacion interactiva de FastAPI. |

## Probar la API

### PowerShell (Windows)

```powershell
Invoke-RestMethod http://localhost:8001/
Invoke-WebRequest http://localhost:8001/contact
```

### Bash / Linux / macOS

```bash
curl http://localhost:8001/
curl http://localhost:8001/contact
```

## Comandos utiles

### `docker compose ps`

Muestra los servicios que estan corriendo y su estado.

### `docker compose up -d --build`

Construye la imagen y levanta el contenedor. El `-d` significa "detached": los
corre en segundo plano sin bloquear la terminal.

### `docker compose logs -f`

Muestra los logs del contenedor en vivo. `Ctrl + C` corta el seguimiento, pero
no apaga el contenedor.

### `docker compose exec qwerty123-web-server bash`

Entra dentro del contenedor y abre una terminal bash. Es como "meterte adentro"
para ejecutar comandos. El nombre `qwerty123-web-server` es el `container_name`
definido en el `docker-compose.yml`.

### `docker compose down`

Apaga y elimina el contenedor. Es el opuesto de `up`. La imagen se conserva.

### `docker compose down --rmi local`

Ademas de apagar el contenedor, elimina la imagen construida localmente.

### Dentro del contenedor

Una vez adentro con bash se usan comandos de Linux normales:

```bash
ls                # ver archivos
cd carpeta        # entrar a una carpeta
pwd               # ver en que carpeta estas
cat main.py       # ver el contenido de un archivo
python main.py    # correr un script
exit              # salir del contenedor
```

## Correr sin Docker

Las instrucciones completas estan en [README.md](README.md). Resumen desde la
carpeta `web-server`:

```powershell
python -m venv env
.\env\Scripts\Activate.ps1
python -m pip install -r requirements.txt

# Levantar el servidor web en el puerto 8000
uvicorn main:app --reload --port 8000
```

> Ojo: `python main.py` **no** levanta el servidor. Ese comando ejecuta
> `store.get_razas()`, que consulta la API de perros e imprime el resultado.
> Para levantar la API hay que usar `uvicorn main:app`.

El contenedor de **este proyecto** (Clase8) usa el puerto `8001`, asi que la
version local en `8000` no choca con el. Pero si la aplicacion de **Clase9**
esta levantada, ella ocupa `8000`: apagala con `docker compose down` desde su
carpeta o usa otro puerto:

```powershell
uvicorn main:app --reload --port 8002
```

Si cambiaste el mapeo del compose de Clase8 a `8000:80`, apaga el contenedor
antes de correr la version local.

## Que es un volume

Un volume conecta una carpeta de tu PC con una carpeta dentro del contenedor,
para que los archivos se compartan entre los dos.

**Este proyecto no necesita volume** porque la API solo devuelve datos y no
guarda archivos. Si en el futuro la aplicacion escribiera archivos, se podria
agregar algo asi:

```yaml
volumes:
  - ./datos:/app/datos
```

Es importante porque los contenedores son temporales: al hacer
`docker compose down` lo que estaba adentro se borra. Con un volume, los
archivos se guardan en tu PC y no se pierden.

## Errores comunes

- **`docker: command not found` / no se reconoce**
  Docker Desktop no esta instalado, no esta corriendo, o la terminal es vieja.
  Abrir Docker Desktop, cerrar y abrir la terminal, y probar `docker --version`.

- **WSL no encuentra la distro**
  En Docker Desktop ir a `Settings → Resources → WSL Integration` y activar la
  integracion con la distro instalada.

- **`COPY failed: ... requirement.txt: not found`**
  El `Dockerfile` debe copiar `requirements.txt` (con `s`). Revisar que el
  nombre coincida exactamente con el archivo real.

- **El contenedor arranca pero la app no responde**
  Revisar que el `CMD` del `Dockerfile` ejecute `uvicorn main:app`. En Compose,
  la linea `command:` **reemplaza** ese `CMD`; no usarla para dejar el
  contenedor "vivo" con un `sleep`. Ver `docker compose logs`.

- **El puerto 8001 esta ocupado**
  Cambiar el mapeo en `docker-compose.yml`, por ejemplo `"8002:80"`, y entrar a
  `http://localhost:8002`.

- **El volume no funciona / error de YAML**
  La linea tiene que llevar un espacio despues del guion: `- ./datos:/app/datos`
  (no `-./datos:/app/datos`).

- **Permiso denegado en Linux**
  Agregar el usuario al grupo `docker` o usar `sudo` para los comandos de
  Docker. En Windows con Docker Desktop no hace falta `sudo`.

## Diferencia con correr sin Docker

| | Sin Docker | Con Docker |
| --- | --- | --- |
| Requiere Python instalado | Si | No |
| Instala dependencias en tu PC | Si, en `env/` | No, quedan en la imagen |
| Comando para arrancar | `uvicorn main:app --reload --port 8000` | `docker compose up -d --build` |
| Puerto local | `8000` | `8001` |
| Instrucciones | [README.md](README.md) | Este archivo |
