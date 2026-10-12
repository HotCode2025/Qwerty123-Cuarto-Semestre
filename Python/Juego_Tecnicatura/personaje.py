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
        # Desplaza la nave según las teclas
        self.shape.x += dx
        self.shape.y += dy

    def lanzar_laser(self):
        # El láser sale desde la punta de la nave
        laser = Laser(self.shape.centerx, self.shape.top)
        self.lasers.append(laser)

# Si el enemigo lo toca va a disminuir la energia un 10%
    def recibir_dano(self):
        self.energia -= 10
        if self.energia <= 0:
            self.energia = 0 # evita que la barra quede negativa
            return False     # sin energía: Game Over
        return True

    def dibujar(self, screen):
        screen.blit(self.image, self.shape.topleft)
        for laser in self.lasers:
            laser.dibujar(screen)
            laser.mover()  # avanza un paso por cada frame

        # Barra de energía: fondo rojo y encima la parte verde
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
        self.rect.y -= 5  # Velocidad del láser

    def dibujar(self, screen):
        screen.blit(self.image, self.rect.topleft)