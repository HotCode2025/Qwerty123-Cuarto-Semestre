# Qwerty123 - Population API (Clase 9)

Mini API hecha con **FastAPI** que lee el archivo `data.csv` con la poblacion
mundial por pais y genera graficos con **matplotlib**.

La aplicacion se puede correr de dos formas:

- **Local**, con Python y un entorno virtual (este README).
- **Con Docker**, sin instalar Python (ver [README-DOCKER.md](README-DOCKER.md)).

## Requisitos

- Python **3.12 o superior**.
- `pip` (viene incluido con Python).

## Estructura del proyecto

| Archivo | Descripcion |
| --- | --- |
| `main.py` | API FastAPI y punto de entrada de la aplicacion. |
| `charts.py` | Genera los graficos de torta y de barras. |
| `utils.py` | Funciones para obtener la poblacion de un pais. |
| `read_csv.py` | Lectura del CSV con el modulo `csv`. |
| `data.csv` | Datos de poblacion mundial por pais. |
| `imgs/` | Carpeta donde se guardan los graficos generados. |
| `requirements.txt` | Dependencias del proyecto con versiones fijas. |
| `Dockerfile` | Receta para construir la imagen Docker. |
| `docker-compose.yml` | Configuracion para levantar el contenedor. |

## Correr local (sin Docker)

### Windows (PowerShell)

Desde la raiz del repositorio:

```powershell
cd .\Python\Clase9_Entorno_Profesional\app

python -m venv env
.\env\Scripts\Activate.ps1

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

python main.py
```

Si PowerShell bloquea la activacion del entorno virtual, ejecutar una vez:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Linux / macOS

Desde la carpeta `app`:

```bash
python3 -m venv env
source env/bin/activate

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

python main.py
```

El servidor queda escuchando en `http://localhost:8000`.

> Si el contenedor de Docker esta levantado, va a ocupar el puerto `8000`.
> Antes de correr la app en local, apagalo con `docker compose down`, o cambia
> el puerto con `uvicorn main:app --reload --port 8001`.

## Abrir la aplicacion

Con el servidor corriendo, entrar desde el navegador a:

- **Documentacion interactiva:** http://localhost:8000/docs
- **Estado del servicio:** http://localhost:8000/health

### Endpoints

| Metodo | Ruta | Que devuelve |
| --- | --- | --- |
| GET | `/health` | `{"status": "ok"}` si la app esta funcionando. |
| GET | `/countries` | Lista de paises. Acepta `?continent=Africa`. |
| GET | `/population/{country}` | Poblacion historica del pais. |
| GET | `/charts/pie` | PNG con el porcentaje de poblacion. Acepta `?continent=Africa`. |
| GET | `/charts/bar/{country}` | PNG con la poblacion historica del pais. |

Ejemplos:

```powershell
Invoke-RestMethod http://localhost:8000/population/Panama
Invoke-WebRequest http://localhost:8000/charts/bar/Panama -OutFile .\imgs\Panama.png
```

Los graficos se guardan en la carpeta `imgs/` del proyecto.

## Detener el servidor

En la terminal donde esta corriendo, presionar `Ctrl + C`.
Para salir del entorno virtual:

```powershell
deactivate
```

## Correr con Docker

Con Docker Desktop instalado y corriendo, desde la carpeta `app`:

```powershell
docker compose up -d --build
```

La aplicacion queda disponible en `http://localhost:8000`.
Las instrucciones completas estan en [README-DOCKER.md](README-DOCKER.md).

## Verificar dependencias

```powershell
python -m pip check
```

Resultado esperado: `No broken requirements found.`
