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


## 11.2 Comandos de trabajo profesional y GitHub — Issue #218

Después de crear requirements.txt y actualizar el README, el profesor
registra los cambios con Git y los comparte mediante GitHub.

### Comandos utilizados

| Comando | Función |
| --- | --- |
| `deactivate` | Desactiva el entorno virtual en la terminal actual. |
| `git status` | Muestra la rama actual y el estado de los archivos. |
| `git branch` | Lista las ramas locales y señala la rama actual. |
| `git add` | Prepara cambios para incluirlos en el próximo commit. |
| `git commit -m "mensaje"` | Registra los cambios preparados en la rama actual. |
| `git push origin rama` | Envía los commits de la rama al repositorio remoto. |
| `git checkout rama` | Cambia a otra rama. |
| `git merge otra_rama` | Integra otra rama en la rama actual. |
| `git pull origin rama` | Descarga e integra la rama remota indicada en la rama actual. |

En el video, el profesor utiliza `git add .` para preparar los cambios.
En nuestro trabajo seleccionamos los archivos de cada Issue mediante
sus rutas.

### Recorrido del profesor

Los siguientes comandos corresponden a las ramas de su repositorio.

Primero registra y sube los cambios desde ariel22:

```bash
git status
git add .
git branch
git commit -m "Creación del archivo requirements.txt para la instalación de dependencias"
git push origin ariel22
```

Después integra esos cambios en second y publica esa rama:

```bash
git checkout second
git merge ariel22
git push origin second
git checkout main
```

En GitHub crea un Pull Request desde second hacia main.
Revisa los cambios y completa la fusión.

Luego actualiza main en su computadora, integra sus cambios en profe
y publica esa rama:

```bash
git pull origin main
git checkout profe
git merge main
git push origin profe
git checkout ariel22
```

Un Pull Request permite proponer y revisar cambios antes de integrarlos
en la rama de destino.

### Aplicación en nuestro repositorio

Trabajamos en la rama respaldo-main y realizamos un commit y una subida
por cada Issue.

La Issue #217 incorporó requirements.txt y las instrucciones de uso.
La Issue #218 documenta los comandos de Git y el recorrido por GitHub.

El entorno virtual env permanece excluido mediante .gitignore.

## 11.3 Pasamos a la librería Requests — Issue #219

Requests es una librería de Python que permite realizar peticiones HTTP.

En el video se explora Dog API y su respuesta en formato JSON.
El endpoint seleccionado para listar las razas es:

https://dog.ceo/api/breeds/list/all

### Preparación de web-server

Se crea la carpeta web-server dentro de Clase8_Entorno_Profesional.
Esta carpeta tiene su propio entorno virtual env y su requirements.txt.

Desde la carpeta web-server, en PowerShell:

```powershell
py -3.13 -m venv env
.\env\Scripts\Activate.ps1
python -m pip install requests
python -m pip freeze
python -m pip freeze | Set-Content -Encoding utf8 requirements.txt
Get-Content .\requirements.txt
```

El archivo requirements.txt registra Requests y sus dependencias
con las versiones instaladas en el entorno.

Para instalar las dependencias registradas, con el entorno activo:

```powershell
python -m pip install -r requirements.txt
```

### Verificación

```powershell
python -m pip check
```

Resultado obtenido: No broken requirements found.

Termina esta parte abriendo web-server en VS Code con
`code . -r`. Hasta aquí queda preparado el entorno; el código para
consultar la API se desarrolla en las siguientes partes.

La carpeta env queda excluida del repositorio mediante .gitignore.