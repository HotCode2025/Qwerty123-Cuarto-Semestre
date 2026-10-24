# Clase 8-B: Python en entorno Profesional Parte 6

## 11.1 Archivo requirements.txt — Issue #217

El archivo requirements.txt registra los paquetes instalados en el
entorno virtual y sus versiones exactas. Permite que otros integrantes
instalen las mismas dependencias.

En este repositorio, la aplicación está en
Python/Clase05_Entorno_Profesional/app y utiliza matplotlib.

El entorno virtual env se crea en cada computadora y no se sube a GitHub.
El archivo requirements.txt sí se comparte.

### Preparar y ejecutar la aplicación en Windows (PowerShell)

Desde la raíz del repositorio:

```powershell
cd .\Python\Clase05_Entorno_Profesional\app
py -3.13 -m venv env
.\env\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python main.py
```

La opción -r indica que pip debe leer las dependencias desde el archivo.

### Crear requirements.txt

Desde la carpeta app, con el entorno virtual activo:

```powershell
python -m pip freeze
python -m pip freeze | Set-Content -Encoding utf8 requirements.txt
Get-Content .\requirements.txt
```

pip freeze muestra los paquetes instalados y sus versiones.
El segundo comando guarda ese listado en requirements.txt con codificación UTF-8.

### Referencia para Linux

Desde la carpeta app:

```bash
python3 -m venv env
source env/bin/activate
python -m pip install -r requirements.txt
python main.py
```

### Verificación de dependencias

```powershell
python -m pip check
```

Resultado obtenido: No broken requirements found.