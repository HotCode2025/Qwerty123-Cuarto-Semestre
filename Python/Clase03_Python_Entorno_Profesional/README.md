# Registro de comandos e instalacion de dependencias - Entorno Profesional Parte 9.2

## 1. Intentar ejecutar Python

```bash
python
```

Este comando intenta abrir el intérprete de Python utilizando el comando `python`.

En este caso, el sistema indicó que `python` no estaba disponible y mostró algunas opciones para instalarlo. También informó que Python 3 ya estaba instalado y que podía ejecutarse con `python3`.

---

## 2. Ejecutar Python 3

```bash
python3
```

Este comando abre el intérprete de **Python 3**.

En la clase se comprobó que Python estaba instalado correctamente:

```text
Python 3.6.9
```

Dentro del intérprete se ejecutó:

```python
print("Hola alumnos")
```

El resultado fue:

```text
Hola alumnos
```

Para salir del intérprete de Python:

```python
exit()
```

---

## 3. Comprobar la versión de pip3

```bash
pip3 -V
```

Este comando muestra la versión de `pip3`, que es el administrador de paquetes de Python.

En la clase se obtuvo:

```text
pip 9.0.1 from /usr/lib/python3/dist-packages (python 3.6)
```

Esto permite comprobar que `pip3` está instalado y asociado a Python 3.

---

## 4. Instalar herramientas y dependencias necesarias

```bash
apt install -y build-essential libssl-dev libffi-dev python3-dev
```

Este comando instala varios paquetes necesarios para trabajar y compilar determinadas herramientas o librerías de Python, donde los comandos se ejecutan como usuario `root`, por eso no aparece `sudo` delante del `apt` :

- `build-essential`: instala herramientas básicas de compilación.
- `libssl-dev`: proporciona archivos necesarios para trabajar con OpenSSL.
- `libffi-dev`: proporciona archivos de desarrollo de la biblioteca `libffi`.
- `python3-dev`: instala archivos necesarios para desarrollar y compilar extensiones para Python 3.
- `-y`: acepta automáticamente las confirmaciones durante la instalación.



---

## Resumen

Los comandos utilizados, en orden, fueron:

```bash
python
python3
pip3 -V
apt install -y build-essential libssl-dev libffi-dev python3-dev
```

### Objetivo

Estos comandos permiten:

1. Comprobar si el comando `python` está disponible.
2. Ejecutar Python 3.
3. Comprobar que `pip3` está instalado y conocer su versión.
4. Instalar herramientas y archivos de desarrollo necesarios para trabajar con Python.
   
# Configuraciones e instalaciones para solucionar posibles errores

En esta sección se detallan diferentes soluciones para resolver problemas al intentar ejecutar el comando `code .` desde WSL / Ubuntu.

---

## Soluciones si no ejecuta el comando `code .`

###  Solución 1: Crear un alias en `.bashrc`

>Si la terminal no reconoce el comando `code .`, una alternativa práctica es definir un **alias** apuntando directamente al ejecutable de Visual Studio Code en Windows.

1. Abre el archivo de configuración de Bash ejecutando:
   ```bash
   sudo nano ~/.bashrc

En el editor de texto que se abre, desplázate hasta el final del archivo e inserta la siguiente línea (asegúrate de reemplazar [TU_USUARIO] por tu nombre de usuario de Windows):

```bash
alias code='/mnt/c/Users/[TU_USUARIO]/AppData/Local/Programs/"Microsoft VS Code"/Code.exe'
```
Guarda los cambios y sal del editor
1. Presiona **Ctrl + O** y luego Enter para guardar.
2. Presiona **Ctrl + X** para salir.
3. Reinicia la terminal de WSL para aplicar las configuraciones

###  Solución 2: Agregar la ruta de VS Code al `PATH`

>Si prefieres que la terminal encuentre automáticamente el ejecutable de VS Code, puedes añadir la ruta del directorio `bin` a tu variable de entorno `PATH`:

Ejecuta el siguiente comando en la terminal:
```bash
export PATH="$PATH:/mnt/c/Program Files/Microsoft VS Code/bin"
```
Nota: Asegúrate de reemplazar `/mnt/c/Program Files/Microsoft VS Code` **por la ruta real donde se encuentra la instalación de VS Code en tu sistema si es diferente.**

###  Solución 3: Ejecutar Ubuntu como Administrador
>A veces el problema se debe a restricciones de permisos en el sistema Windows.

1. Abre la aplicación de Ubuntu (o tu terminal WSL) haciendo clic derecho y seleccionando **Ejecutar como Administrador**.
2. Navega a la carpeta de tu proyecto:
```bash
cd nombreCarpeta
```
3. Ejecuta el comando para abrir el directorio actual en VS Code:
```bash
code .
```

###  ¡Listo! Con esto el proyecto se abrirá correctamente.

---

## Ejecutar un archivo de Python

Para ejecutar un archivo `.py` desde la terminal, primero hay que ubicarse en la carpeta donde se encuentra el archivo.

### 1. Comprobar los archivos del directorio

```bash
ll
```

Este comando permite listar los archivos del directorio actual y verificar que se encuentre el archivo de Python que se desea ejecutar. En este caso, el archivo es `py-project.py`.

### 2. Ejecutar el archivo con Python 3

```bash
python3 py-project.py
```

Este comando ejecuta el archivo `py-project.py` utilizando **Python 3**.

En la clase, el programa mostró el siguiente resultado:

```text
Hola desde esta máquina
```

### Resumen

```bash
ll
python3 py-project.py
```

Estos comandos permiten verificar que el archivo se encuentra en el directorio actual y luego ejecutarlo utilizando Python 3.

---

# Crear un repositorio en GitHub desde la terminal

Para crear un repositorio Git de forma local, primero se utiliza:

```bash
git init
```

> Si el repositorio ya fue creado en GitHub y lo traemos a nuestro equipo mediante `git clone`, **no es necesario ejecutar `git init`**.

## Comandos utilizados

Primero podemos listar los archivos del directorio actual:

```bash
ll
```

Luego vinculamos nuestro repositorio local con el repositorio remoto de GitHub:

```bash
git remote add origin git@github.com:ArielBetancud22/python-project.git
```

Para comprobar que el repositorio remoto fue agregado correctamente:

```bash
git remote -v
```

Agregamos los archivos al área de preparación (*staging area*):

```bash
git add *
```

Comprobamos el estado del repositorio:

```bash
git status
```

Creamos el primer commit:

```bash
git commit -m "Mi primer commit"
```

Volvemos a comprobar el estado:

```bash
git status
```

Consultamos las ramas existentes:

```bash
git branch
```

Finalmente, enviamos los cambios al repositorio remoto. Si la rama utilizada es `master`:

```bash
git push origin master
```

En caso de utilizar `main`:

```bash
git push origin main
```

Al realizar el `push`, Git puede solicitar la autenticación correspondiente.

Para volver al directorio anterior y entrar nuevamente al proyecto:

```bash
cd ..
cd py-project
```

---

# Solucionar fallas de conexión con GitHub mediante SSH

Si GitHub no permite realizar el `push` mediante SSH, podemos configurar una clave SSH siguiendo estos pasos.

## Paso 1: Comprobar el directorio SSH

```bash
ls -al ~/.ssh
```

Este comando permite comprobar si ya existen claves SSH en el equipo.

## Paso 2: Generar una nueva clave SSH

```bash
ssh-keygen -t ed25519 -C "tu_correo@mail.com"
```

El correo debe reemplazarse por el correo asociado a la cuenta de GitHub.

## Paso 3: Elegir dónde guardar la clave

La terminal mostrará algo similar a:

```text
Enter file in which to save the key (/root/.ssh/id_ed25519):
```

Si queremos utilizar la ubicación predeterminada, no escribimos nada y simplemente presionamos **Enter**.

## Paso 4: Ingresar una contraseña para la clave

La terminal mostrará:

```text
Enter passphrase (empty for no passphrase):
```

Podemos ingresar una contraseña para proteger la clave SSH.

## Paso 5: Confirmar la contraseña

```text
Enter same passphrase again:
```

Ingresamos nuevamente la misma contraseña.

## Paso 6: Verificar la creación de la clave

Al finalizar, la terminal mostrará información de la nueva clave, incluyendo su *fingerprint*.

## Paso 7: Iniciar el agente SSH

```bash
eval "$(ssh-agent -s)"
```

Este comando inicia `ssh-agent`, que permite administrar las claves SSH durante la sesión.

## Paso 8: Agregar la clave privada al agente SSH

```bash
ssh-add ~/.ssh/id_ed25519
```

## Paso 9: Ingresar la contraseña de la clave

Si configuramos una *passphrase* al crear la clave, `ssh-add` solicitará que la ingresemos.

## Paso 10: Mostrar la clave pública

```bash
cat ~/.ssh/id_ed25519.pub
```

Debemos copiar **todo el contenido de la clave pública** que aparece en la terminal.

## Paso 11: Agregar la clave en GitHub

En GitHub ingresar a:

**Perfil → Settings → SSH and GPG keys**

## Paso 12: Crear una nueva clave SSH

Seleccionar:

**New SSH key**

## Paso 13: Colocar un título

Ingresar un título que permita identificar el equipo donde se generó la clave.

## Paso 14: Pegar la clave pública

Pegar el contenido obtenido mediante:

```bash
cat ~/.ssh/id_ed25519.pub
```

Luego guardar la nueva clave en GitHub.

## Paso 15: Realizar nuevamente el push

Si la rama es `master`:

```bash
git push origin master
```

Si la rama es `main`:

```bash
git push origin main
```

> Es importante verificar previamente el nombre de la rama con `git branch`. Si se hace `push` de una rama local diferente de la existente en GitHub, pueden terminar existiendo ambas ramas (`main` y `master`).

---

## Resumen de comandos para configurar SSH

```bash
ls -al ~/.ssh
ssh-keygen -t ed25519 -C "tu_correo@mail.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
git push origin master
```
