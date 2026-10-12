import os

# Dimension de la pantalla, el alto y el ancho de la pantalla
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

# Especificamos los colores de la pantalla

COLOR_LASER = (0,0,255) # azul

# Ruta a la carpeta assets
ASSETS_PATH = os.path.join(os.path.dirname(__file__), 'assets_1')

#Rutas de Los archivos
IMPERIAL_MARCH_PATH = f'{ASSETS_PATH}/sounds/Imperial March - Kenobi.mp3'
START_IMAGE_PATH = f'{ASSETS_PATH}/images/inicio/star.png'
ESTRELLA_PATH = f'{ASSETS_PATH}/images/inicio/estrella'
FONDO1_PATH =f'{ASSETS_PATH}/images/fondo1.jpg'