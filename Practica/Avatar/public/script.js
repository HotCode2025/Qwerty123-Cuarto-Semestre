// 1. CLASE MAESTRA DE AVATARS (Programación Orientada a Objetos)
// Modificamos el constructor para recibir la ruta de la imagen
class Avatar {
    constructor(nombre, rutaImagen, elemento) {
        this.nombre = nombre;
        this.imagen = rutaImagen; // Guardamos la ruta del archivo
        this.elemento = elemento; 
        this.vidas = 3;
    }
}

// Actualizamos el catálogo con las rutas de tus imágenes locales
const personajesDisponibles = {
    zuko: new Avatar("Zuko", "./imagenes/Zuko.jpg", "fuego"),
    katara: new Avatar("Katara", "./imagenes/Katara.jpg", "agua"),
    aang: new Avatar("Aang", "./imagenes/Ang.jpg", "aire"),
    toph: new Avatar("Toph", "./imagenes/toph.jpg", "tierra")
};

let jugador;
let enemigo;

// Matriz de Ventajas e Inmunidades Elementales
// "Clave" le gana a "Valor"
// Nueva lógica de combate: Clave le gana a Valor
const ventajas = {
    patada: "puño",   // La patada tiene más alcance que el puño
    puño: "barrida",   // El puño interrumpe la agachada de la barrida
    barrida: "patada"  // La barrida derriba al que tira una patada alta
};

const MOVIMIENTOS = ['puño', 'patada', 'barrida'];

// Mapeo elemento -> IDs de botones de ataque exclusivos
const BOTONES_POR_ELEMENTO = {
    fuego: ['btn-llamas', 'btn-explosion'],
    agua: ['btn-tsunami', 'btn-tormenta'],
    aire: ['btn-tornado', 'btn-huracan'],
    tierra: ['btn-terremoto', 'btn-meteoritos']
};

// 2. CONFIGURACIÓN INICIAL DEL DOM
const seccionSeleccionar = document.getElementById('seccion-seleccionar');
const seccionCombate = document.getElementById('seccion-combate');
const seccionMensajes = document.getElementById('seccion-mensajes');
const seccionReiniciar = document.getElementById('seccion-reiniciar');

const btnPersonaje = document.getElementById('btn-personaje');
const btnReiniciar = document.getElementById('btn-reiniciar');
const textoResultado = document.getElementById('texto-resultado');

const visualJugador = document.getElementById('visual-jugador');
const visualEnemigo = document.getElementById('visual-enemigo');
const vidasJugador = document.getElementById('vidas-jugador');
const vidasEnemigo = document.getElementById('vidas-enemigo');
const barraJ = document.getElementById('barra-j');
const barraE = document.getElementById('barra-e');
const nombreJugadorPantalla = document.getElementById('nombre-jugador-pantalla');
const nombreEnemigoPantalla = document.getElementById('nombre-enemigo-pantalla');

// Botones de ataque
document.getElementById('btn-puño').addEventListener('click', () => procesarTurno('puño'));
document.getElementById('btn-patada').addEventListener('click', () => procesarTurno('patada'));
document.getElementById('btn-barrida').addEventListener('click', () => procesarTurno('barrida'));

btnPersonaje.addEventListener('click', seleccionarPersonajeJugador);
btnReiniciar.addEventListener('click', () => location.reload());

// 3.5 GESTIÓN DEL MODAL DE REGLAS
const showRulesBtn = document.getElementById('show-rules');
const modalReglas = document.getElementById('modal-reglas');
const btnCerrarReglas = document.getElementById('btn-cerrar-reglas');

showRulesBtn.addEventListener('click', () => {
    modalReglas.classList.add('activo');
});

// Botón de reglas durante el combate
const showRulesCombatBtn = document.getElementById('show-rules-combat');
showRulesCombatBtn.addEventListener('click', () => {
    modalReglas.classList.add('activo');
});

btnCerrarReglas.addEventListener('click', () => {
    modalReglas.classList.remove('activo');
});

// Cerrar modal al hacer click fuera del contenido
modalReglas.addEventListener('click', (e) => {
    if (e.target === modalReglas) {
        modalReglas.classList.remove('activo');
    }
});

// 3. SELECCIÓN DE PERSONAJES
function seleccionarPersonajeJugador() {
    const opciones = document.getElementsByName('personaje');
    let seleccionID = null;

    for (let opcion of opciones) {
        if (opcion.checked) {
            seleccionID = opcion.id;
            break;
        }
    }

    if (!seleccionID) {
        alert("¡Debes elegir un maestro antes de ir a la arena!");
        return;
    }

    // Instanciar jugador clonando los datos base
    const baseJ = personajesDisponibles[seleccionID];
    jugador = new Avatar(baseJ.nombre, baseJ.imagen, baseJ.elemento);

    // Automatización del enemigo (Selección Aleatoria)
    const claves = Object.keys(personajesDisponibles);
    const eleccionAzar = claves[Math.floor(Math.random() * claves.length)];
    const baseE = personajesDisponibles[eleccionAzar];
    enemigo = new Avatar(baseE.nombre, baseE.imagen, baseE.elemento);

    prepararPantallaArena();
}

function mostrarBotonesDeElemento(elemento) {
    BOTONES_POR_ELEMENTO[elemento].forEach((id) => {
        document.getElementById(id).classList.remove('oculto');
    });
}

function ocultarTodosLosBotones() {
    Object.values(BOTONES_POR_ELEMENTO).flat().forEach((id) => {
        document.getElementById(id).classList.add('oculto');
    });
}

function configurarBotonesDeAtaque() {
    mostrarBotonesDeElemento(jugador.elemento);
}

function prepararPantallaArena() {
    seccionSeleccionar.classList.add('oculto');
    seccionCombate.classList.remove('oculto');
    seccionMensajes.classList.remove('oculto');
    seccionReiniciar.classList.remove('oculto');

    // Render de la foto del Jugador
    visualJugador.querySelector('.sprite').innerHTML = 
        `<img src="${jugador.imagen}" alt="${jugador.nombre}" class="foto-render">`;
    nombreJugadorPantalla.textContent = jugador.nombre;
    
    // Render de la foto del Enemigo (¡Corregido!)
    visualEnemigo.querySelector('.sprite').innerHTML = 
        `<img src="${enemigo.imagen}" alt="${enemigo.nombre}" class="foto-render">`;
    nombreEnemigoPantalla.textContent = enemigo.nombre + " (Rival)";

    // Llamamos a la nueva función que configura tus ataques exclusivos
    configurarBotonesDeAtaque();

    // Ocultamos todos los botones de ataque primero
    ocultarTodosLosBotones();
}

// 4. LÓGICA DE COMBATE CON VENTAJAS Y ANIMACIONES
// Actualizamos la función para recibir el elemento y el nombre del ataque del jugador
function procesarTurno(ataqueJugador) {
    if (jugador.vidas <= 0 || enemigo.vidas <= 0) return;

    // La máquina elige al azar uno de los 3 movimientos de combate
    const ataqueEnemigo = MOVIMIENTOS[Math.floor(Math.random() * MOVIMIENTOS.length)];

    // Animaciones visuales de las tarjetas (Se mantienen)
    visualJugador.classList.add('ataque-jugador');
    visualEnemigo.classList.add('ataque-enemigo');
    setTimeout(() => {
        visualJugador.classList.remove('ataque-jugador');
        visualEnemigo.classList.remove('ataque-enemigo');
    }, 200);

    // Resolución del Choque de Golpes
    if (ataqueJugador === ataqueEnemigo) {
        textoResultado.innerHTML = `Lanzaste <strong>${ataqueJugador.toUpperCase()}</strong>. <br>El rival bloqueó con <strong>${ataqueEnemigo.toUpperCase()}</strong>. <br>💥 ¡Fuerzas niveladas! Choque de guardias.`;
    } 
    else if (ventajas[ataqueJugador] === ataqueEnemigo) {
        enemigo.vidas--;
        visualEnemigo.classList.add('recibir-daño');
        setTimeout(() => visualEnemigo.classList.remove('recibir-daño'), 400);
        
        textoResultado.innerHTML = `¡Tu <strong>${ataqueJugador.toUpperCase()}</strong> conectó con éxito contra la <strong>${ataqueEnemigo.toUpperCase()}</strong> del rival! <br>🏆 ¡Impacto limpio! Dañas al enemigo.`;
    } 
    else {
        jugador.vidas--;
        visualJugador.classList.add('recibir-daño');
        setTimeout(() => visualJugador.classList.remove('recibir-daño'), 400);

        textoResultado.innerHTML = `Tu <strong>${ataqueJugador.toUpperCase()}</strong> fue anticipado por la <strong>${ataqueEnemigo.toUpperCase()}</strong> del rival. <br>💀 ¡Te han contragolpeado! Pierdes una vida.`;
    }

    actualizarInterfazVidas();
    verificarEstadoFinal();
}

function actualizarInterfazVidas() {
    // Números de vidas
    vidasJugador.textContent = jugador.vidas;
    vidasEnemigo.textContent = enemigo.vidas;

    // Modificación de barras de salud dinámicas (Porcentaje)
    const porcJ = (jugador.vidas / 3) * 100;
    const porcE = (enemigo.vidas / 3) * 100;

    barraJ.style.width = `${porcJ}%`;
    barraE.style.width = `${porcE}%`;

    // Cambiar color de la barra si la vida es crítica
    if (jugador.vidas === 1) barraJ.style.backgroundColor = "#ef4444";
    if (enemigo.vidas === 1) barraE.style.backgroundColor = "#ef4444";
}

function verificarEstadoFinal() {
    if (jugador.vidas === 0 || enemigo.vidas === 0) {
        btnReiniciar.classList.remove('oculto');

        if (jugador.vidas === 0 && enemigo.vidas === 0) {
            textoResultado.innerHTML = "🏁 <strong>¡MUTUO K.O.! Ambos guerreros han caído en combate.</strong>";
        } else if (jugador.vidas === 0) {
            textoResultado.innerHTML = "❌ <strong>¡Derrota! Te has quedado sin energía espiritual. El enemigo gana.</strong>";
        } else {
            textoResultado.innerHTML = "👑 <strong>¡VICTORIA! Has demostrado ser el verdadero maestro elemental.</strong>";
        }
    }
}
