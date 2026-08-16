-- Comenzamos con CRUD: create(insertar), read (leer), update(actualizar), delete(eliminar)
-- Listar los estudiantes (read)
SELECT * FROM estudiante2026;
-- Insertar estudiantes
INSERT INTO estudiante2026(nombre,apellido,telefono,email) VALUES ("Juan", "Perez", "2614545456", "juan@mail.com");
-- Update (modificar)
UPDATE estudiante2026 SET nombre= "Juan Carlos", apellido= "Garcia" WHERE idestudiantes2026=1;
-- Delete (eliminar)
DELETE FROM estudiante2026 WHERE idestudiantes2026=5;
-- Para modificar el idestudiante2026 y comienze con 1
ALTER TABLE estudiante2026 AUTO_INCREMENT = 1;