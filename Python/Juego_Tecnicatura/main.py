import pygame
import sys
import random
import os
from personaje import Personaje , Enemigo , Explosion
from constantes import SCREEN_WIDTH , SCREEN_HEIGHT , ASSETS_PATH


def mostrar_imagen_inicial(screen, imagen_path, duracion):
    imagen = pygame.image.load(imagen_path).convert()
    imagen = pygame.transform.scale(imagen, (SCREEN_WIDTH, SCREEN_HEIGHT))

    # Bucle para mostrar la imagen inicial con desvanecimiento
    alpha = 255  # Transparencia inicial completa
    clock = pygame.time.Clock()

    tiempo_inicial = pygame.time.get_ticks()
    tiempo_total = duracion  # Duración en milisegundos (8000 ms para 8 segundos)
    while pygame.time.get_ticks() - tiempo_inicial < tiempo_total:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        # Calcular el tiempo transcurrido
        tiempo_transcurrido = pygame.time.get_ticks() - tiempo_inicial

        # Calcular nuevo valor de alpha basado en el tiempo transcurrido
        alpha = 255 - (255 * (tiempo_transcurrido / tiempo_total))
        if alpha < 0:
            alpha = 0

        # Establecer transparencia y dibujar la imagen
        imagen.set_alpha(int(alpha))
        screen.fill((0, 0, 0))  # Llenar pantalla con negro antes de dibujar la imagen
        screen.blit(imagen, (0, 0))
        pygame.display.flip()

        clock.tick(60)  # Mantener 60 FPS


def main() :
    pygame.init ( )
    screen = pygame.display.set_mode ( (SCREEN_WIDTH , SCREEN_HEIGHT) )
    pygame.display.set_caption ( 'Amenaza Fantasma' )

    # Definir la ruta a la imagen inicial
    imagen_inicial_path = os.path.join ( ASSETS_PATH , 'images' , 'inicio' , 'star.png' )

    # Mostrar la imagen inicial durante 5 segundos
    mostrar_imagen_inicial ( screen , imagen_inicial_path , 5000 )

    # Usa os.path.join para construir la ruta del icono
    icon = pygame.image.load ( os.path.join ( ASSETS_PATH , 'images' , '001.jfif' ) )
    pygame.display.set_icon ( icon )

    # Inicializar los fondos
    fondo2 = pygame.image.load ( os.path.join ( ASSETS_PATH , 'images' , 'fondo2.jfif' ) )
    fondo2 = pygame.transform.scale ( fondo2 , (SCREEN_WIDTH , SCREEN_HEIGHT) )

    fondo3 = pygame.image.load ( os.path.join ( ASSETS_PATH , 'images' , 'fondo3.jpg' ) )
    fondo3 = pygame.transform.scale ( fondo3 , (SCREEN_WIDTH , SCREEN_HEIGHT) )

    # Inicializar el fondo actual
    fondo_actual = fondo2

    # Usa os.path.join para construir las rutas de los sonidos
    sonido_laser = pygame.mixer.Sound ( os.path.join ( ASSETS_PATH , 'sounds' , 'laserdis.mp3' ) )
    sonido_explosion = pygame.mixer.Sound ( os.path.join ( ASSETS_PATH , 'sounds' , 'explosion.mp3' ) )

    # Reproducir sonido de fondo
    pygame.mixer.music.load ( os.path.join ( ASSETS_PATH , 'sounds' , 'efectos.mp3' ) )
    pygame.mixer.music.play ( -1 )  # Reproduce el sonido en un bucle

    personaje = Personaje ( SCREEN_WIDTH // 2 , SCREEN_HEIGHT // 2 )
    enemigos = [ ]
    explosiones = [ ]
    puntos = 0
    nivel = 1

    clock = pygame.time.Clock ( )
    running = True
    while running :
        for event in pygame.event.get ( ) :
            if event.type == pygame.QUIT :
                pygame.quit ( )
                sys.exit ( )

        keys = pygame.key.get_pressed ( )
        dx , dy = 0 , 0
        if keys [ pygame.K_LEFT ] :
            dx = -5
        if keys [ pygame.K_RIGHT ] :
            dx = 5
        if keys [ pygame.K_UP ] :
            dy = -5
        if keys [ pygame.K_DOWN ] :
            dy = 5

        personaje.mover ( dx , dy )

        if keys [ pygame.K_SPACE ] :
            personaje.lanzar_laser ( )
            sonido_laser.play ( )

        # Actualizar posición de enemigos y manejar colisiones
        for enemigo in enemigos [ : ] :  # Iterar sobre una copia para eliminar de la lista original
            enemigo.mover ( )
            if enemigo.rect.top > SCREEN_HEIGHT :
                enemigos.remove ( enemigo )

            # Verificar colisiones con láseres
            for laser in personaje.lasers [ : ] :  # Iterar sobre una copia para eliminar de la lista original
                if enemigo.rect.colliderect ( laser.rect ) :
                    explosiones.append ( Explosion ( enemigo.rect.centerx , enemigo.rect.centery ) )
                    enemigos.remove ( enemigo )  # Eliminar el enemigo
                    personaje.lasers.remove ( laser )  # Eliminar el láser
                    sonido_explosion.play ( )
                    puntos += 10  # Incrementar el puntajeos
                    break  # Salir del bucle para evitar errores

            if enemigo.rect.colliderect ( personaje.shape ) :
                if not personaje.recibir_dano ( ) :
                    running = False  # Terminar el juego si la energía llega a 0

        # Generar enemigos aleatoriamente
        if random.random ( ) < 0.02 :
            x = random.randint ( 0 , SCREEN_WIDTH - 50 )  # Asegúrate de que el enemigo esté dentro de la pantalla
            enemigo = Enemigo ( x , 0 )
            enemigos.append ( enemigo )

        # Actualizar explosiones
        explosiones = [ explosion for explosion in explosiones if explosion.actualizar ( ) ]

        # Cambiar el fondo cada 250 puntos
        if puntos > 0 and puntos % 250 == 0 :
            if fondo_actual == fondo2 :
                fondo_actual = fondo3
            else :
                fondo_actual = fondo2
            puntos += 10  # Aumenta puntos para evitar el cambio de fondo continuo

        # Dibujar fondo y objetos en la pantalla
        screen.blit ( fondo_actual , (0 , 0) )
        personaje.dibujar ( screen )
        for enemigo in enemigos :
            enemigo.dibujar ( screen )
        for explosion in explosiones :
            explosion.dibujar ( screen )

        # Mostrar marcador y nivel
        font = pygame.font.Font ( None , 36 )
        texto_puntos = font.render ( f"Puntos: {puntos}" , True , (255 , 255 , 255) )
        texto_nivel = font.render ( f"Nivel: {nivel}" , True , (255 , 255 , 255) )
        screen.blit ( texto_puntos , (10 , 50) )
        screen.blit ( texto_nivel , (10 , 90) )

        if puntos >= 250 :
            nivel += 1
            puntos = 0  # Resetea el puntaje al cambiar de nivel

        pygame.display.flip ( )
        clock.tick ( 60 )

    # Mostrar mensaje de GAME OVER
    screen.fill ( (0 , 0 , 0) )

    # Definir fuente
    font_large = pygame.font.Font ( None , 74 )
    font_small = pygame.font.Font ( None , 36 )

    # Renderizar textos
    texto_game_over = font_large.render ( "GAME OVER" , True , (255 , 0 , 0) )
    texto_mensaje = font_small.render ( "Que la Fuerza te acompañe" , True , (255 , 255 , 255) )

    # Calcular posiciones para centrar el texto
    pos_x_game_over = SCREEN_WIDTH // 2 - texto_game_over.get_width ( ) // 2
    pos_y_game_over = SCREEN_HEIGHT // 2 - texto_game_over.get_height ( ) // 2 - 20  # Ajusta el margen vertical

    pos_x_mensaje = SCREEN_WIDTH // 2 - texto_mensaje.get_width ( ) // 2
    pos_y_mensaje = SCREEN_HEIGHT // 2 + texto_game_over.get_height ( ) // 2 + 20  # Ajusta el margen vertical

    # Dibujar textos en la pantalla
    screen.blit ( texto_game_over , (pos_x_game_over , pos_y_game_over) )
    screen.blit ( texto_mensaje , (pos_x_mensaje , pos_y_mensaje) )

    # Actualizar la pantalla
    pygame.display.flip ( )
    pygame.time.wait ( 2000 )  # Mostrar GAME OVER durante 2 segundos
    pygame.quit ( )
    sys.exit ( )


if __name__ == '__main__' :
    main ( )