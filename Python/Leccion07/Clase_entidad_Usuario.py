class Usuario:
    """
    Responsabilidades:
    Crear objetos de entidad Usuario
    """
    def __init__(self, id_usuario: int = None, username: str = None, password: str = None):
        self._id_usuario = id_usuario
        self._username = username
        self._password = password

    def __str__(self) -> str:
        return f'Usuario [ID: {self._id_usuario}, Username: {self._username}, Password: {self._password}]'

    # --- GETTERS Y SETTERS ---

    # id_usuario
    @property
    def id_usuario(self) -> int:
        return self._id_usuario

    @id_usuario.setter
    def id_usuario(self, id_usuario: int):
        self._id_usuario = id_usuario

    # username
    @property
    def username(self) -> str:
        return self._username

    @username.setter
    def username(self, username: str):
        self._username = username

    # password
    @property
    def password(self) -> str:
        return self._password

    @password.setter
    def password(self, password: str):
        self._password = password


# --- PRUEBA DE LA CLASE ---
if __name__ == '__main__':
    # 1. Crear un usuario completo
    usuario1 = Usuario(1, 'jdoe', 'pasword123')
    print(usuario1)  # Llama automáticamente al método __str__()

    # 2. Modificar atributos mediante setters
    usuario1.username = 'juan_perez'
    print(f'Nuevo username: {usuario1.username}')

    # 3. Crear usuario sin ID (útil para cuando insertas en la DB y el ID es autoincremental)
    usuario_nuevo = Usuario(username='maria_g', password='securepassword')
    print(usuario_nuevo)