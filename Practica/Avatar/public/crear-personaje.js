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

    // Al volver desde creación, resetear filtros en cascada sin pisar
    // la preselección que pudo dejar renderizarPersonajes(id).
    if (typeof resetearFiltrosCascada === "function") {
        const select = document.getElementById('select-personaje');
        const idActual = select ? select.value : "";
        resetearFiltrosCascada();
        poblarOpcionesSelect(personajesDisponibles);
        if (idActual && personajesDisponibles.some(p => p.id === idActual)) {
            select.value = idActual;
        }
        const contador = document.getElementById('contador-resultados');
        if (contador) {
            contador.textContent =
                `${personajesDisponibles.length} personaje(s) encontrado(s)`;
        }
    }
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
    if (typeof actualizarVisibilidadFiltro === "function") {
        actualizarVisibilidadFiltro();
    }
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


// =============================================================================
// GENERACIÓN MASIVA DE PERSONAJES
// =============================================================================

const inputCantidadMasiva = document.getElementById('input-cantidad-masiva');
const btnGenerarMasivo    = document.getElementById('btn-generar-masivo');
const progresoMasivo      = document.getElementById('progreso-masivo');
const barraProgresoRelleno = document.getElementById('barra-progreso-relleno');
const textoProgresoMasivo = document.getElementById('texto-progreso-masivo');

/**
 * Convierte un entero pequeño (hasta ~50) a numeral romano.
 */
function numeroARomano(n) {
    const valores = [
        [50, "L"], [40, "XL"], [10, "X"], [9, "IX"],
        [5, "V"], [4, "IV"], [1, "I"]
    ];
    let resultado = "";
    let restante = n;

    for (const [valor, simbolo] of valores) {
        while (restante >= valor) {
            resultado += simbolo;
            restante -= valor;
        }
    }
    return resultado;
}

/**
 * Nombre determinístico según índice global, reutilizando NOMBRES_AVATAR
 * con sufijos romanos en cada vuelta (II, III, ...).
 */
function generarNombreUnico(indiceGlobal) {
    const total = NOMBRES_AVATAR.length;
    const vuelta = Math.floor(indiceGlobal / total);
    const nombreBase = NOMBRES_AVATAR[indiceGlobal % total];

    if (vuelta === 0) return nombreBase;
    return `${nombreBase} ${numeroARomano(vuelta + 1)}`;
}

/**
 * Crea un Avatar sin tocar la UI ni el array global.
 * El id se valida contra un Set (O(1)) en vez de recorrer personajesDisponibles.
 */
function crearAvatarSinEfectosUI(nombre, elemento, alias, idsExistentes) {
    let idBase = nombre
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    let id = idBase;
    let contador = 2;
    while (idsExistentes.has(id)) {
        id = `${idBase}-${contador}`;
        contador++;
    }

    idsExistentes.add(id);
    return new Avatar(id, nombre, "", elemento, alias);
}

function actualizarTextoBotonMasivo() {
    const cantidad = parseInt(inputCantidadMasiva.value, 10);
    const n = Number.isFinite(cantidad) && cantidad > 0 ? cantidad : 0;
    btnGenerarMasivo.textContent = `Generar ${n} personajes`;
}

function generarPersonajesMasivo(cantidad) {
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 1000) {
        alert("Ingresá un número entero entre 1 y 1000.");
        return;
    }

    const idsExistentes = new Set(personajesDisponibles.map(p => p.id));
    const tamanoLote = 50;
    const mostrarProgreso = cantidad > tamanoLote;
    let generados = 0;

    if (mostrarProgreso) {
        btnGenerarMasivo.style.display = "none";
        progresoMasivo.style.display = "block";
        barraProgresoRelleno.style.width = "0%";
        textoProgresoMasivo.textContent = `Generando... 0/${cantidad}`;
    }

    function procesarLote() {
        const limiteLote = Math.min(tamanoLote, cantidad - generados);

        for (let i = 0; i < limiteLote; i++) {
            const indiceGlobal = generados;
            const elemento = elegirAleatorio(ELEMENTOS_DISPONIBLES);
            const alias = elegirAleatorio(ALIAS_POR_ELEMENTO[elemento]);
            const nombre = generarNombreUnico(indiceGlobal);
            const avatar = crearAvatarSinEfectosUI(nombre, elemento, alias, idsExistentes);
            personajesDisponibles.push(avatar);
            generados++;
        }

        if (mostrarProgreso) {
            const porcentaje = (generados / cantidad) * 100;
            barraProgresoRelleno.style.width = `${porcentaje}%`;
            textoProgresoMasivo.textContent = `Generando... ${generados}/${cantidad}`;
        }

        if (generados < cantidad) {
            setTimeout(procesarLote, 0);
            return;
        }

        if (mostrarProgreso) {
            progresoMasivo.style.display = "none";
            btnGenerarMasivo.style.display = "";
        }

        renderizarPersonajes();
        if (typeof actualizarVisibilidadFiltro === "function") {
            actualizarVisibilidadFiltro();
        }
        volverASeleccion();
    }

    if (mostrarProgreso) {
        setTimeout(procesarLote, 0);
    } else {
        procesarLote();
    }
}

inputCantidadMasiva.addEventListener('input', actualizarTextoBotonMasivo);
btnGenerarMasivo.addEventListener('click', () => {
    const cantidad = parseInt(inputCantidadMasiva.value, 10);
    generarPersonajesMasivo(cantidad);
});

actualizarTextoBotonMasivo();
