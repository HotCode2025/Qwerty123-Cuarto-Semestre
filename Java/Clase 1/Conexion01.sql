-- Comenzamos con CRUD: create(insertar), read (leer), update(actualizar), delete(eliminar)
-- Listar los estudiantes (read)
SELECT * FROM estudiantes2022;
-- Insertar estudiantes
INSERT INTO estudiantes2022(nombre,apellido,telefono,email) VALUES ("Juan", "Perez", "2614545456", "juan@mail.com");
-- Update (modificar)
UPDATE estudiantes2022 SET nombre= "Juan Carlos", apellido= "Garcia" WHERE idestudiantes2022=1;
-- Delete (eliminar)
DELETE FROM estudiantes2022 WHERE idestudiantes2022=5;
-- Para modificar el idestudiante2026 y comienze con 1
ALTER TABLE estudiantes2022 AUTO_INCREMENT = 1;