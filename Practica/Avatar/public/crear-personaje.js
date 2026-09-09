// =============================================================================
// CREACIÓN DE PERSONAJES
// Listas temáticas + alta manual/aleatoria sobre el array compartido
// personajesDisponibles (definido en script.js).
// =============================================================================

const NOMBRES_AVATAR = [
    "Iroh", "Azula", "Ozai", "Mai", "Ty Lee", "Jeong Jeong",
    "Sokka", "Pakku", "Hama", "Yugoda",
    "Gyatso", "Jinora", "Tenzin",
    "Bumi", "Jet", "Longshot", "Smellerbee",
    "Suki", "Piandao", "June"
];

const ALIAS_POR_ELEMENTO = {
    fuego:  ["Señor del Fuego", "Llama Eterna", "Dragón del Oeste", "Llama Sagrada"],
    agua:   ["Curador del Norte", "Espíritu del Mar", "Voz del Ártico"],
    aire:   ["Monje Viajero", "Susurro del Viento", "Espíritu Libre"],
    tierra: ["Guardián de la Roca", "Voz de la Montaña", "Puño de Granito"]
};

const EMOJI_POR_ELEMENTO = {
    fuego: "🔥", agua: "💧", aire: "🌪️", tierra: "🌱"
};

const ELEMENTOS_DISPONIBLES = ["fuego", "agua", "aire", "tierra"];


// =============================================================================
// REFERENCIAS AL DOM (la sección de creación)
// =============================================================================

const seccionCrear = document.getElementById('seccion-crear');
const inputNombre  = document.getElementById('input-nombre');
const selectElemento = document.getElementById('select-elemento');
const inputAlias   = document.getElementById('input-alias');
const btnCrearPersonaje = document.getElementById('btn-crear');
const btnCrearManual = document.getElementById('btn-crear-manual');
const btnGenerarAleatorio = document.getElementById('btn-generar-aleatorio');
const btnVolverSeleccion = document.getElementById('btn-volver-seleccion');


// =============================================================================
// NAVEGACIÓN ENTRE SECCIONES (sin recargar la página)
// =============================================================================

function irACrearPersonaje() {
    document.getElementById('seccion-seleccionar').classList.add('oculto');
    seccionCrear.classList.remove('oculto');
}

function volverASeleccion() {
    seccionCrear.classList.add('oculto');
    document.getElementById('seccion-seleccionar').classList.remove('oculto');
}

btnCrearPersonaje.addEventListener('click', irACrearPersonaje);
btnVolverSeleccion.addEventListener('click', volverASeleccion);


// =============================================================================
// UTILIDADES
// =============================================================================

function elegirAleatorio(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

/**
 * Convierte el nombre en un id único: minúsculas y espacios → guiones.
 * Si el id ya existe en el catálogo, agrega un sufijo numérico.
 */
function slugifyNombre(nombre) {
    let idBase = nombre
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    let id = idBase;
    let contador = 2;
    while (personajesDisponibles.some(p => p.id === id)) {
        id = `${idBase}-${contador}`;
        contador++;
    }
    return id;
}

/**
 * Crea el Avatar, lo agrega al array compartido, refresca el dropdown
 * y vuelve a la pantalla de selección con el nuevo personaje elegido.
 */
function registrarPersonaje(nombre, elemento, alias) {
    const id = slugifyNombre(nombre);
    // Sin foto: el sprite de la arena usará el emoji del elemento
    const nuevo = new Avatar(id, nombre, "", elemento, alias);
    personajesDisponibles.push(nuevo);

    renderizarPersonajes(id);
    volverASeleccion();
    limpiarFormularioCrear();
}

function limpiarFormularioCrear() {
    inputNombre.value = "";
    inputAlias.value = "";
    selectElemento.value = "";
}


// =============================================================================
// CREAR MANUAL / GENERAR ALEATORIO
// =============================================================================

function crearPersonajeManual() {
    const nombre   = inputNombre.value.trim();
    const elemento = selectElemento.value;
    const alias    = inputAlias.value.trim();

    if (!nombre || !alias || !elemento) {
        alert("Completá el nombre, el alias y elegí un elemento.");
        return;
    }

    registrarPersonaje(nombre, elemento, alias);
}

function generarPersonajeAleatorio() {
    const nombre   = elegirAleatorio(NOMBRES_AVATAR);
    const elemento = elegirAleatorio(ELEMENTOS_DISPONIBLES);
    const alias    = elegirAleatorio(ALIAS_POR_ELEMENTO[elemento]);

    registrarPersonaje(nombre, elemento, alias);
}

btnCrearManual.addEventListener('click', crearPersonajeManual);
btnGenerarAleatorio.addEventListener('click', generarPersonajeAleatorio);
