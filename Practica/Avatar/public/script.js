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
// 2. CONFIGURACIÓN INICIAL DEL DOM
const seccionSeleccionar = document.getElementById('seccion-seleccionar');
const seccionCombate = document.getElementById('seccion-combate');
const seccionMensajes = document.getElementById('seccion-mensajes');
const seccionReiniciar = document.getElementById('seccion-reiniciar');

const btnPersonaje = document.getElementById('btn-personaje');
const btnReiniciar = document.getElementById('btn-reiniciar');
const textoResultado = document.getElementById('texto-resultado');

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

function configurarBotonesDeAtaque() {
    // Activación por elemento del jugador
    if (jugador.elemento === 'fuego') {
        document.getElementById('btn-llamas').classList.remove('oculto');
        document.getElementById('btn-explosion').classList.remove('oculto');
    }
    if (jugador.elemento === 'agua') {
        document.getElementById('btn-tsunami').classList.remove('oculto');
        document.getElementById('btn-tormenta').classList.remove('oculto');
    }
    if (jugador.elemento === 'aire') {
        document.getElementById('btn-tornado').classList.remove('oculto');
        document.getElementById('btn-huracan').classList.remove('oculto');
    }
    if (jugador.elemento === 'tierra') {
        document.getElementById('btn-terremoto').classList.remove('oculto');
        document.getElementById('btn-meteoritos').classList.remove('oculto');
    }
}

function prepararPantallaArena() {
    seccionSeleccionar.classList.add('oculto');
    seccionCombate.classList.remove('oculto');
    seccionMensajes.classList.remove('oculto');
    seccionReiniciar.classList.remove('oculto');

    // Render de la foto del Jugador
    document.getElementById('visual-jugador').querySelector('.sprite').innerHTML = 
        `<img src="${jugador.imagen}" alt="${jugador.nombre}" class="foto-render">`;
    document.getElementById('nombre-jugador-pantalla').textContent = jugador.nombre;
    
    // Render de la foto del Enemigo (¡Corregido!)
    document.getElementById('visual-enemigo').querySelector('.sprite').innerHTML = 
        `<img src="${enemigo.imagen}" alt="${enemigo.nombre}" class="foto-render">`;
    document.getElementById('nombre-enemigo-pantalla').textContent = enemigo.nombre + " (Rival)";

    // Llamamos a la nueva función que configura tus ataques exclusivos
    configurarBotonesDeAtaque();

    // Ocultamos todos los botones de ataque primero
    document.getElementById('boton-fuego').classList.add('oculto');
    document.getElementById('boton-agua').classList.add('oculto');
    document.getElementById('boton-aire').classList.add('oculto');
    document.getElementById('boton-tierra').classList.add('oculto');

    
}

// 4. LÓGICA DE COMBATE CON VENTAJAS Y ANIMACIONES
// Actualizamos la función para recibir el elemento y el nombre del ataque del jugador
function procesarTurno(ataqueJugador) {
    if (jugador.vidas <= 0 || enemigo.vidas <= 0) return;

    // La máquina elige al azar uno de los 3 movimientos de combate
    const movimientos = ['puño', 'patada', 'barrida'];
    const ataqueEnemigo = movimientos[Math.floor(Math.random() * movimientos.length)];

    // Animaciones visuales de las tarjetas (Se mantienen)
    const cardJ = document.getElementById('visual-jugador');
    const cardE = document.getElementById('visual-enemigo');
    cardJ.classList.add('ataque-jugador');
    cardE.classList.add('ataque-enemigo');
    setTimeout(() => {
        cardJ.classList.remove('ataque-jugador');
        cardE.classList.remove('ataque-enemigo');
    }, 200);

    // Resolución del Choque de Golpes
    if (ataqueJugador === ataqueEnemigo) {
        textoResultado.innerHTML = `Lanzaste <strong>${ataqueJugador.toUpperCase()}</strong>. <br>El rival bloqueó con <strong>${ataqueEnemigo.toUpperCase()}</strong>. <br>💥 ¡Fuerzas niveladas! Choque de guardias.`;
    } 
    else if (ventajas[ataqueJugador] === ataqueEnemigo) {
        enemigo.vidas--;
        cardE.classList.add('recibir-daño');
        setTimeout(() => cardE.classList.remove('recibir-daño'), 400);
        
        textoResultado.innerHTML = `¡Tu <strong>${ataqueJugador.toUpperCase()}</strong> conectó con éxito contra la <strong>${ataqueEnemigo.toUpperCase()}</strong> del rival! <br>🏆 ¡Impacto limpio! Dañas al enemigo.`;
    } 
    else {
        jugador.vidas--;
        cardJ.classList.add('recibir-daño');
        setTimeout(() => cardJ.classList.remove('recibir-daño'), 400);

        textoResultado.innerHTML = `Tu <strong>${ataqueJugador.toUpperCase()}</strong> fue anticipado por la <strong>${ataqueEnemigo.toUpperCase()}</strong> del rival. <br>💀 ¡Te han contragolpeado! Pierdes una vida.`;
    }

    actualizarInterfazVidas();
    verificarEstadoFinal();
}

function actualizarInterfazVidas() {
    // Números de vidas
    document.getElementById('vidas-jugador').textContent = jugador.vidas;
    document.getElementById('vidas-enemigo').textContent = enemigo.vidas;

    // Modificación de barras de salud dinámicas (Porcentaje)
    const porcJ = (jugador.vidas / 3) * 100;
    const porcE = (enemigo.vidas / 3) * 100;

    const barraJ = document.getElementById('barra-j');
    const barraE = document.getElementById('barra-e');

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