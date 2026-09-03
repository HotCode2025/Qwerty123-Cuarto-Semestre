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