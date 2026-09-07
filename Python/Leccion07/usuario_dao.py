from Clase_entidad_Usuario import Usuario
from cursor_del_pool import CursorDelPool
from logger_base import log


class UsuarioDao:
    """
    Responsabilidades:
    Realizar las operaciones CRUD (Create-Read-Update-Delete)
    sobre la entidad Usuario (tabla usuario)
    """

    SELECCIONAR = 'SELECT id_usuario, username, password FROM public.usuario ORDER BY id_usuario'
    INSERTAR = 'INSERT INTO public.usuario (username, password) VALUES (%s, %s) RETURNING id_usuario'
    ACTUALIZAR = 'UPDATE public.usuario SET username = %s, password = %s WHERE id_usuario = %s'
    ELIMINAR = 'DELETE FROM public.usuario WHERE id_usuario = %s'

    @classmethod
    def seleccionar(cls) -> list[Usuario]:
        usuarios = []
        with CursorDelPool() as cursor:
            cursor.execute(cls.SELECCIONAR)
            for id_usuario, username, password in cursor.fetchall():
                usuarios.append(Usuario(id_usuario, username, password))
        log.debug(f'Se obtuvieron {len(usuarios)} usuarios')
        return usuarios

    @classmethod
    def insertar(cls, usuario: Usuario) -> int:
        with CursorDelPool() as cursor:
            cursor.execute(cls.INSERTAR, (usuario.username, usuario.password))
            id_usuario = cursor.fetchone()[0]
        log.debug(f'Usuario insertado con id {id_usuario}')
        return id_usuario

    @classmethod
    def actualizar(cls, usuario: Usuario) -> int:
        with CursorDelPool() as cursor:
            cursor.execute(cls.ACTUALIZAR, (usuario.username, usuario.password, usuario.id_usuario))
            filas_afectadas = cursor.rowcount
        log.debug(f'Se actualizaron {filas_afectadas} fila/s del usuario {usuario.id_usuario}')
        return filas_afectadas

    @classmethod
    def eliminar(cls, usuario: Usuario) -> int:
        with CursorDelPool() as cursor:
            cursor.execute(cls.ELIMINAR, (usuario.id_usuario,))
            filas_afectadas = cursor.rowcount
        log.debug(f'Se eliminaron {filas_afectadas} fila/s del usuario {usuario.id_usuario}')
        return filas_afectadas


# --- PRUEBA DE LA CLASE ---
if __name__ == '__main__':
    # 1. Listar usuarios existentes
    for u in UsuarioDao.seleccionar():
        print(u)

    # 2. Insertar un usuario nuevo
    nuevo = Usuario(username='prueba_dao', password='clave123')
    nuevo.id_usuario = UsuarioDao.insertar(nuevo)
    print(f'Insertado: {nuevo}')

    # 3. Actualizar el usuario insertado
    nuevo.password = 'clave_actualizada'
    filas = UsuarioDao.actualizar(nuevo)
    print(f'Filas actualizadas: {filas}')

    # 4. Eliminar el usuario insertado
    filas = UsuarioDao.eliminar(nuevo)
    print(f'Filas eliminadas: {filas}')
