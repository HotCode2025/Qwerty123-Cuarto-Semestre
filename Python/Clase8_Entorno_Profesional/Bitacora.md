# Comandos usados por el profesor Ariel al crear un repositorio
Estos comandos fueron usados para darles entornos virtuales a:

## clase 05 -> Entornos Profesionales -> app

```bash
mkdir py-project
cd py-project
git clone httpps://...
ll
cd python-pip
code .
git branch #Solo esta rama
#main
git branch second #Comenzamos a crear nuevas ramas
git branch profe
git branch ariel22
git status # Desde la rama main ya hay cambios para commitear
git add
git commit -m"Agrego el archivo txt donde detallo cada parte de las clases"
git push origin main 
#Surge un problema,debo crear un access token para poder cargar cambios
#Se debe entrar en GitHub settings - Developer settings-Personal acces Tokens - token classic
#Se genera escribiendo las notas de que trabajo se va a tratar y se deben tildar cuanto tiempo de duracion tendra el token y tildar los permisos,generar y por ultimo copiar el token
git pull origin main
Usuario: arielBetancud22
password: accessTOken # EL que hemos creado y debemos guardar bien

which python3 #Donde esta la ruta
which pip
```
*No vamos a crear un repositorio nuevo,pero dejamos constancia de lo que hizo el profesor con WLS*

## Mas comandos usados por el profesor

```bash
sudo apt install -y python3-venv #Esto es para crear el entorno en WLS o Linux
cd app
pwd
python3 -m venv env #Creamos el entorno
source env/bin/activate # Activacion del entorno
deactivate #Desactivamos el entorno
source env/bin/activate
which python3
```
Aqui creado el entorno,nos va a retornar la ubicacion de la carpeta donde esta activada el entorno
*Para esto sirven los entornos*

```bash
which pip3
pip3 freeze
pip3 install matplotlib
source .venv/bin/activate
```
### ACLARACION
Si se trabaja desde linux es asi como se activa

Pero si se trabaja desde una terminal basada en bash en Windows
```bash
source .venv/Scripts/activate
```
*Terminal cmd o PowerShell*
```sh
.venv\Scripts\activate
```

## Clase 04 -> Entornos Profesionales -> game

```bash
python3 -m venv env
ll
source env/bin/activate
pip3 freeze #VEMOS LAS LIBRERIAS O MODULOS EN EL ENTORNO
pip3 install matplotlib ==3.5.0 #INSTALAMOS UNA VERSION ESPECIFICA
```
