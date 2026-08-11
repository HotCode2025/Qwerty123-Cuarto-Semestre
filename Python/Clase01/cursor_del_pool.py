from logger_base import log
from conexion import Conexion


class CursorDelPool:
    def __init__(self):
        self.conexion = None
        self.cursor = None

    def __enter__(self):
        log.debug("Inicio del método with y __enter__")
        self.conexion = Conexion.obtenerConexion()
        self.cursor = self.conexion.cursor()
        return self.cursor

    def __exit__(self, tipo_exception, valor_exception, detalle_exception):
        log.debug("Se ejecuta el método exit")
        if valor_exception:
            self.conexion.rollback()
            log.debug(f"Ocurrió una excepción: {valor_exception}")

        else:
            self.conexion.commit()
            log.debug("Commit de la transacción")
        self.cursor.close()
        Conexion.liberarConexion(self.conexion)


if __name__ == "__main__":
    with CursorDelPool() as cursor:
        log.debug("Estamos dentro del bloque with")
        cursor.execute("SELECT * FROM persona")
        log.debug(cursor.fetchall())
