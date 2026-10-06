import pygame
import os  # proporciona funcionalidades para interactuar con el sistema
from constantes import ASSETS_PATH

class Personaje:
    def __init__(self, x, y):
        # Construye la ruta completa a la imagen del personaje
        self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'Speeder.png'))
        self.image = pygame.transform.scale(self.image, (95, 95))
        self.shape = self.image.get_rect(center=(x, y))
        self.lasers = []
        self.energia = 100  # Barra de energía inicial

    def mover(self, dx, dy):
        self.shape.x += dx
        self.shape.y += dy

    def lanzar_laser(self):
        laser = Laser(self.shape.centerx, self.shape.top)
        self.lasers.append(laser)

    def recibir_dano(self):
        self.energia -= 10
        if self.energia <= 0:
            self.energia = 0
            return False
        return True

    def dibujar(self, screen):
        screen.blit(self.image, self.shape.topleft)
        for laser in self.lasers:
            laser.dibujar(screen)
            laser.mover()

        # Dibujar la barra de energía
        pygame.draw.rect(screen, (255, 0, 0), (10, 10, 100, 10))  # Barra de fondo
        pygame.draw.rect(screen, (0, 255, 0), (10, 10, self.energia, 10))  # Barra de energía

class Enemigo:
    def __init__(self, x, y):
        # Construye la ruta completa a la imagen del enemigo
        self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'enemigo1.png'))
        self.image = pygame.transform.scale(self.image, (80, 80))
        self.rect = self.image.get_rect(topleft=(x, y))

    def mover(self):
        self.rect.y += 5  # Velocidad de movimiento del enemigo

    def dibujar(self, screen):
        screen.blit(self.image, self.rect.topleft)

class Laser:
    def __init__(self, x, y):
        # Construye la ruta completa a la imagen del láser
        self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'lase1.png'))
        self.rect = self.image.get_rect(center=(x, y))

    def mover(self):
        self.rect.y -= 10  # Velocidad del láser

    def dibujar(self, screen):
        screen.blit(self.image, self.rect.topleft)

class Explosion:
    def __init__(self, x, y):
        # Construye la ruta completa a las imágenes de la explosión
        self.images = [pygame.image.load(os.path.join(ASSETS_PATH, 'images', f'regularExplosion0{i:02d}.png')) for i in range(9)]
        self.index = 0  # Índice para la animación
        self.image = self.images[self.index]  # Imagen actual
        self.rect = self.image.get_rect(center=(x, y))  # Rectángulo de la imagen
        self.frame_rate = 0  # Contador de frames para la animación
        self.max_frames = 20  # Frames por imagen

    def actualizar(self):
        # Actualiza la animación
        self.frame_rate += 1
        if self.frame_rate >= self.max_frames:
            self.frame_rate = 0
            self.index += 1
            if self.index >= len(self.images):
                return False  # Termina la animación si se han mostrado todas las imágenes
            self.image = self.images[self.index]
        return True

    def dibujar(self, screen):
        # Dibuja la imagen en la pantalla
        screen.blit(self.image, self.rect.topleft)