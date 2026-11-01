# DOCKER

Esta guia explica como correr la **Population API** con Docker, sin necesidad de
instalar Python en la computadora.

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

Define el servicio `web`:

- Construye la imagen usando el `Dockerfile`.
- Publica el puerto `8000` de tu PC hacia el puerto `80` del contenedor.
- Monta `./imgs` para que los graficos queden guardados en tu disco.
- Tiene un `healthcheck` que verifica `GET /health`.

### `.dockerignore`

Lista los archivos que **no** se copian a la imagen (entorno virtual, cache de
Python, graficos generados, etc.). Asi la imagen es mas chica y el build mas
rapido.

## Como levantar el proyecto con Docker

Siempre desde la carpeta `app`, donde esta el `docker-compose.yml`:

```powershell
cd .\Python\Clase9_Entorno_Profesional\app

# 1. Construir la imagen y levantar el contenedor
docker compose up -d --build

# 2. Ver que este corriendo y sano
docker compose ps
```

En `docker compose ps` el estado tiene que figurar como `Up (healthy)`.

Abrir en el navegador:

- **Documentacion interactiva:** http://localhost:8000/docs
- **Estado del servicio:** http://localhost:8000/health

## Endpoints

| Metodo | Ruta | Que devuelve |
| --- | --- | --- |
| GET | `/health` | `{"status": "ok"}` si el contenedor esta vivo. |
| GET | `/countries` | Lista de paises. Acepta `?continent=Africa`. |
| GET | `/population/{country}` | Poblacion historica del pais. |
| GET | `/charts/pie` | PNG con el porcentaje de poblacion. Acepta `?continent=Africa`. |
| GET | `/charts/bar/{country}` | PNG con la poblacion historica del pais. |

## Probar la API

### PowerShell (Windows)

```powershell
Invoke-RestMethod http://localhost:8000/population/Panama
Invoke-WebRequest http://localhost:8000/charts/bar/Panama -OutFile .\imgs\Panama.png
Invoke-WebRequest "http://localhost:8000/charts/pie?continent=Africa" -OutFile .\imgs\pie-Africa.png
```

### Bash / Linux / macOS

```bash
curl http://localhost:8000/population/Panama
curl -o imgs/Panama.png http://localhost:8000/charts/bar/Panama
curl -o imgs/pie-Africa.png "http://localhost:8000/charts/pie?continent=Africa"
```

Los graficos se guardan en `./imgs` de tu PC gracias al volume.

## Comandos utiles

### `docker compose ps`

Muestra los servicios que estan corriendo y su estado.

### `docker compose up -d --build`

Construye la imagen y levanta el contenedor. El `-d` significa "detached": los
corre en segundo plano sin bloquear la terminal.

### `docker compose logs -f`

Muestra los logs del contenedor en vivo. `Ctrl + C` corta el seguimiento, pero
no apaga el contenedor.

### `docker compose exec qwerty123-app bash`

Entra dentro del contenedor llamado `qwerty123-app` y abre una terminal bash.
Es como "meterte adentro" para ejecutar comandos. El nombre `qwerty123-app` es
el `container_name` definido en el `docker-compose.yml`.

### `docker compose down`

Apaga y elimina el contenedor. Es el opuesto de `up`. La imagen y los archivos
de `./imgs` se conservan.

### `docker compose down --rmi local`

Ademas de apagar el contenedor, elimina la imagen construida localmente.

### Dentro del contenedor

Una vez adentro con bash se usan comandos de Linux normales:

```bash
ls                # ver archivos
cd carpeta        # entrar a una carpeta
pwd               # ver en que carpeta estas
cat data.csv      # ver el contenido de un archivo
python main.py    # correr un script
exit              # salir del contenedor
```

## Que es un volume

Un volume conecta una carpeta de tu PC con una carpeta dentro del contenedor,
para que los archivos se compartan entre los dos.

En este proyecto:

```text
./imgs (tu PC)  <-->  /app/imgs (contenedor)
```

Es importante porque los contenedores son temporales: al hacer
`docker compose down` lo que estaba adentro se borra. Con el volume, los
graficos se guardan en `./imgs` de tu PC y no se pierden.

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
  Revisar que el `CMD` del `Dockerfile` ejecute `uvicorn main:app` y que el
  puerto publicado sea el correcto (`8000:80`). Ver `docker compose logs`.

- **El puerto 8000 esta ocupado**
  Cambiar el mapeo en `docker-compose.yml`, por ejemplo `"8001:80"`, y entrar a
  `http://localhost:8001`.

- **Permiso denegado en Linux**
  Agregar el usuario al grupo `docker` o usar `sudo` para los comandos de
  Docker. En Windows con Docker Desktop no hace falta `sudo`.

## Diferencia con correr sin Docker

| | Sin Docker | Con Docker |
| --- | --- | --- |
| Requiere Python instalado | Si | No |
| Instala dependencias en tu PC | Si, en `env/` | No, quedan en la imagen |
| Comando para arrancar | `python main.py` | `docker compose up -d --build` |
| Direccion | `http://localhost:8000` | `http://localhost:8000` |
| Instrucciones | [README.md](README.md) | Este archivo |
