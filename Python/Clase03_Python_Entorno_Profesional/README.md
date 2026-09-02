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
