# Issue #197 — Pruebas con la aplicación terminada, Parte 1

## Pruebas realizadas
- Arranque de la aplicación y carga de libros desde MySQL.
- Selección de un libro y carga de sus datos en el formulario.
- Agregado de "Cien años de soledad", con precio 400 y existencias 30.
- Verificación del nuevo libro en MySQL con ID 3.
- Eliminación del registro duplicado con ID 7.
- Verificación en MySQL de que el ID 7 ya no existe.
- Limpieza de los campos después de agregar y eliminar.

## Configuración de IntelliJ
Se solucionó el error de método duplicado $$$getFont$$$ seleccionando
"Java source code on compilation" en GUI Designer y ejecutando
Build → Rebuild Project.

## Resultado
Las pruebas descritas finalizaron correctamente.
No se realizaron cambios funcionales en el código.