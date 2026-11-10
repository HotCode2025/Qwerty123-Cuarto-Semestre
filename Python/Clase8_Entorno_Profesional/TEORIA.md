# TEORIA

Un entorno virtual en programación es un directorio o espacio de trabajo aislado que contiene una copia independiente del intérprete de un lenguaje (como Python) junto con sus propias bibliotecas y dependencias, sin mezclarse con la instalación global del sistema operativo u otros proyectos.

**El núcleo teórico**: Las variables de entorno y el *PATH*

En teoría de sistemas operativos, cuando ejecutas un comando como python o pip en tu terminal, el sistema busca ese programa en una lista de rutas guardada en una variable global llamada PATH.
Cuando activas un entorno virtual, lo que ocurre a nivel teórico y técnico es un enmascaramiento del sistema:
1. Modificación del PATH: El script de activación modifica temporalmente la variable PATH de tu terminal en memoria, colocando la ruta de la carpeta bin (o Scripts en Windows) de tu entorno virtual al principio de todo.
2. Prioridad de ejecución: Como el sistema busca de izquierda a derecha en el PATH, encuentra el ejecutable de Python de tu entorno virtual antes que el Python global del sistema.
3. Redirección de librerías: El intérprete de Python sabe implícitamente que debe buscar y guardar las librerías (en la carpeta site-packages) dentro de la estructura de carpetas del entorno virtual actual, ignorando las globales.


## ¿PORQUE SON NECESARIOS?

• Evitar conflictos de versiones: Un proyecto puede requerir la versión 1.0 de una librería, mientras que otro proyecto diferente necesita la versión 3.0 de esa misma librería.

• Aislamiento del sistema: Permite instalar y desinstalar paquetes libremente sin romper herramientas globales del sistema operativo.

• Portabilidad y colaboración: Facilitan registrar qué librerías exactas usa un proyecto para que otros desarrolladores repliquen el mismo entorno.

## ¿COMO FUNCIONAN?

1. Crear el entorno: Se genera una carpeta (frecuentemente llamada .venv o env) dentro de la raíz del proyecto.
2. Activar el entorno: Al activar la consola en ese espacio, los comandos de instalación apuntan únicamente a esa carpeta aislada.
3. Instalar dependencias: Se utilizan gestores como *pip* para descargar paquetes específicos del proyecto.
4. Desactivar el entorno: Al terminar de trabajar, se sale del espacio virtual mediante el comando de desactivación.


## Arquitectura de un Entorno Virtual en Python

Cuando ejecutas python -m venv mi_entorno, Python crea una estructura física de directorios. Su arquitectura se compone de:
• pyvenv.cfg (El archivo de configuración): Es el corazón teórico del entorno. Es un archivo de texto simple que contiene variables clave como home (que apunta al Python real de tu sistema) e include-system-site-packages = false (que le dice a Python que ignore las librerías globales).
• bin/ o Scripts/: Contiene los scripts de activación (activate) para diferentes terminales (Bash, PowerShell) y copias (o enlaces simbólicos) de los ejecutables python, pip, etc.
• lib/ o Lib/site-packages/: Es el almacén aislado. Cada vez que haces pip install, los archivos del código fuente de esa librería se descargan y descomprimen estrictamente aquí.
Al desactivar el entorno, la variable PATH de tu terminal simplemente se restaura a su estado original, devolviéndote al entorno global.


