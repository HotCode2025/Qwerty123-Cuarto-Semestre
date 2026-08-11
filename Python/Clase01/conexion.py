from dotenv import load_dotenv
import os

load_dotenv()

from psycopg2 import pool
from logger_base import log
import sys


class Conexion:
    DATABASE = "postgres"
    USERNAME = "postgres"
    PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_PORT = "5432"
    HOST = "127.0.0.1"
    MIN_CON = 1
    MAX_CON = 5
    pool = None

    @classmethod
    def obtenerConexion(cls):
        conexion = cls.obtenerPool().getconn()
        log.debug(f"Conexión obtenida del pool: {conexion}")
        return conexion

    @classmethod
    def obtenerCursor(cls):
        pass

    @classmethod
    def obtenerPool(cls):
        if cls.pool is None:
            try:
                cls.pool = pool.SimpleConnectionPool(
                    cls.MIN_CON,
                    cls.MAX_CON,
                    host=cls.HOST,
                    user=cls.USERNAME,
                    password=cls.PASSWORD,
                    port=cls.DB_PORT,
                    database=cls.DATABASE,
                )
                log.debug(f"creación del pool exitosa: {cls.pool}")

            except Exception as e:
                import traceback

                traceback.print_exc()
                log.error(f"Ocurrió un error al obtener el pool: {e}")
                sys.exit()

        return cls.pool

    @classmethod
    def liberarConexion(cls, conexion):
        cls.obtenerPool().putconn(conexion)
        log.debug(f"Regresamos la conexión del pool: {conexion}")

    @classmethod
    def cerrarConexion(cls, conexion):
        cls.obtenerPool().closeall()


if __name__ == "__main__":
    conexion1 = Conexion.obtenerConexion()
    Conexion.liberarConexion(conexion1)
    conexion2 = Conexion.obtenerConexion()
    Conexion.liberarConexion(conexion2)
    conexion3 = Conexion.obtenerConexion()
    Conexion.liberarConexion(conexion3)
    conexion4 = Conexion.obtenerConexion()
    conexion5 = Conexion.obtenerConexion()
    conexion6 = Conexion.obtenerConexion()
