// =============================================================================
// CREAR-PERSONAJE.JS — Alta de personajes nuevos (manual, aleatoria y masiva)
// -----------------------------------------------------------------------------
// IMPORTANTE EN ESTE ARCHIVO:
// NO se define ninguna clase — la clase Avatar y el array
// personajesDisponibles viven en script.js, que se carga ANTES que este
// archivo en avatar.html. Lo que hace este archivo es usar esa clase para
// crear objetos nuevos con "new Avatar(...)" cada vez que el usuario:
//   - completa el formulario y aprieta "Crear Manual"
//   - aprieta "Generar Aleatorio"
//   - aprieta "Generar N personajes" (generación masiva)
// En los tres casos, el objeto resultante termina agregado con .push() al
// mismo array personajesDisponibles que usa el resto del juego.
// =============================================================================

// -----------------------------------------------------------------------------
// LISTAS TEMÁTICAS
// Datos "de catálogo" usados para armar personajes aleatorios y para poblar
// los <select> de filtro. No son objetos Avatar, son simples arrays/objetos
// de JavaScript con texto.
// -----------------------------------------------------------------------------

// Nombres de personajes secundarios del universo Avatar, usados como banco
// de nombres para la generación aleatoria y masiva.
const NOMBRES_AVATAR = [
    "Iroh", "Azula", "Ozai", "Mai", "Ty Lee", "Jeong Jeong",
    "Sokka", "Pakku", "Hama", "Yugoda",
    "Gyatso", "Jinora", "Tenzin",
    "Bumi", "Jet", "Longshot", "Smellerbee",
    "Suki", "Piandao", "June"
];

// Posibles alias descriptivos según el elemento (se eligen al azar al crear
// un personaje aleatorio o masivo).
const ALIAS_POR_ELEMENTO = {
    fuego:  ["Señor del Fuego", "Llama Eterna", "Dragón del Oeste", "Llama Sagrada"],
    agua:   ["Curador del Norte", "Espíritu del Mar", "Voz del Ártico"],
    aire:   ["Monje Viajero", "Susurro del Viento", "Espíritu Libre"],
    tierra: ["Guardián de la Roca", "Voz de la Montaña", "Puño de Granito"]
};

// Emoji representativo de cada elemento (se usa como sprite en la arena
// cuando el personaje no tiene foto propia, y como badge sobre las tarjetas).
const EMOJI_POR_ELEMENTO = {
    fuego: "🔥", agua: "💧", aire: "🌪️", tierra: "🌱"
};

// Lista de los 4 elementos válidos del juego, usada para sortear uno al azar
const ELEMENTOS_DISPONIBLES = ["fuego", "agua", "aire", "tierra"];


// =============================================================================
// REFERENCIAS AL DOM (la sección de creación de personajes)
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
// El juego es una sola página HTML; "navegar" acá significa ocultar una
// <section> y mostrar otra con la clase CSS "oculto".
// =============================================================================

/** Oculta la pantalla de selección y muestra el formulario de creación. */
function irACrearPersonaje() {
    document.getElementById('seccion-seleccionar').classList.add('oculto');
    seccionCrear.classList.remove('oculto');
}

/**
 * Oculta el formulario de creación y vuelve a mostrar la pantalla de
 * selección, dejando los filtros y el contador de resultados actualizados
 * (por si se creó/generó algún personaje mientras tanto).
 */
function volverASeleccion() {
    seccionCrear.classList.add('oculto');
    document.getElementById('seccion-seleccionar').classList.remove('oculto');

    // Al volver desde creación, resetear filtros en cascada sin pisar
    // la preselección que pudo dejar renderizarPersonajes(id).
    // Se valida con typeof porque estas funciones viven en script.js: si por
    // algún motivo ese archivo no cargó antes, esto no rompe el resto.
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
// UTILIDADES GENERALES
// =============================================================================

/**
 * Devuelve un elemento al azar de un array cualquiera.
 * @param {Array} lista
 * @returns {*} Un elemento aleatorio de la lista
 */
function elegirAleatorio(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

/**
 * Convierte un nombre en un id único apto para usar como identificador
 * interno: minúsculas y espacios reemplazados por guiones.
 * Si el id ya existe en el catálogo (por ejemplo, dos personajes llamados
 * "Sokka"), agrega un sufijo numérico creciente (-2, -3, ...) hasta
 * encontrar uno libre.
 *
 * @param {string} nombre
 * @returns {string} id único, listo para usar en un new Avatar(...)
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
 * Punto único por donde pasa TODA alta de personaje individual (manual o
 * aleatoria): genera el id, instancia el Avatar con "new", lo agrega al
 * array compartido personajesDisponibles (definido en script.js), refresca
 * la interfaz y vuelve a la pantalla de selección con el nuevo personaje
 * ya elegido en el dropdown.
 *
 * @param {string} nombre
 * @param {string} elemento - "fuego" | "agua" | "aire" | "tierra"
 * @param {string} alias
 */
function registrarPersonaje(nombre, elemento, alias) {
    const id = slugifyNombre(nombre);
    // Se crea sin ruta de imagen ("") porque no tenemos foto para personajes
    // custom: el sprite de la arena va a usar el emoji del elemento en su lugar
    // (ver renderizarSprite() en script.js).
    const nuevo = new Avatar(id, nombre, "", elemento, alias);
    personajesDisponibles.push(nuevo);

    renderizarPersonajes(id);
    if (typeof actualizarVisibilidadFiltro === "function") {
        actualizarVisibilidadFiltro();
    }
    volverASeleccion();
    limpiarFormularioCrear();
}

/** Vacía los campos del formulario de creación manual. */
function limpiarFormularioCrear() {
    inputNombre.value = "";
    inputAlias.value = "";
    selectElemento.value = "";
}


// =============================================================================
// CREAR MANUAL / GENERAR ALEATORIO
// Dos formas distintas de completar los mismos 3 datos (nombre, elemento,
// alias) que después terminan en la misma función registrarPersonaje().
// =============================================================================

/**
 * Se ejecuta al hacer clic en "Crear Manual". Toma lo que el usuario
 * escribió/eligió en el formulario, valida que no falte nada y da de alta
 * el personaje.
 */
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

/**
 * Se ejecuta al hacer clic en "Generar Aleatorio". Sortea nombre, elemento
 * y alias (coherente con el elemento sorteado) y da de alta el personaje.
 */
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
// Permite crear muchos personajes de una sola vez (hasta 1000). Para no
// congelar la pantalla con cantidades grandes, el trabajo se hace en lotes
// de a 50, cediendo el control al navegador entre lote y lote (setTimeout),
// y mostrando una barra de progreso mientras tanto.
// =============================================================================

const inputCantidadMasiva = document.getElementById('input-cantidad-masiva');
const btnGenerarMasivo    = document.getElementById('btn-generar-masivo');
const progresoMasivo      = document.getElementById('progreso-masivo');
const barraProgresoRelleno = document.getElementById('barra-progreso-relleno');
const textoProgresoMasivo = document.getElementById('texto-progreso-masivo');

/**
 * Convierte un entero pequeño (hasta ~50) a numeral romano.
 * Se usa para diferenciar personajes que repiten nombre base en la
 * generación masiva (ej: "Iroh", "Iroh II", "Iroh III", ...).
 *
 * @param {number} n
 * @returns {string} Numeral romano correspondiente
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
 * Genera un nombre determinístico a partir de un índice global (0, 1, 2...).
 * Recorre NOMBRES_AVATAR en orden y, cuando se termina la lista, empieza de
 * nuevo agregando un sufijo romano ("Iroh II", "Azula II", etc.) para que
 * los nombres no se repitan exactamente igual al pasar de 20 personajes.
 *
 * @param {number} indiceGlobal - posición del personaje dentro de todo el lote
 * @returns {string} Nombre único para ese índice
 */
function generarNombreUnico(indiceGlobal) {
    const total = NOMBRES_AVATAR.length;
    const vuelta = Math.floor(indiceGlobal / total);
    const nombreBase = NOMBRES_AVATAR[indiceGlobal % total];

    if (vuelta === 0) return nombreBase;
    return `${nombreBase} ${numeroARomano(vuelta + 1)}`;
}

/**
 * Crea una instancia de Avatar SIN tocar la interfaz ni el array global
 * todavía (eso lo hace quien llama a esta función). Se usa dentro del
 * bucle de generación masiva, donde conviene separar "crear el objeto"
 * de "mostrarlo en pantalla" por rendimiento.
 *
 * A diferencia de slugifyNombre() (que recorre personajesDisponibles con
 * .some() cada vez), acá el id se valida contra un Set en memoria
 * (idsExistentes), que es mucho más rápido de consultar cuando se están
 * generando cientos de personajes seguidos.
 *
 * @param {string} nombre
 * @param {string} elemento
 * @param {string} alias
 * @param {Set<string>} idsExistentes - ids ya usados, se va completando a medida que se generan
 * @returns {Avatar} La nueva instancia creada (todavía no está en personajesDisponibles)
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

/** Actualiza el texto del botón masivo ("Generar 50 personajes") según el input. */
function actualizarTextoBotonMasivo() {
    const cantidad = parseInt(inputCantidadMasiva.value, 10);
    const n = Number.isFinite(cantidad) && cantidad > 0 ? cantidad : 0;
    btnGenerarMasivo.textContent = `Generar ${n} personajes`;
}

/**
 * Genera "cantidad" personajes nuevos y los agrega al catálogo.
 * Si la cantidad es grande, trabaja en lotes de 50 usando setTimeout(fn, 0)
 * entre lote y lote: esto le da un respiro al navegador para pintar la
 * barra de progreso en vez de trabar la pestaña generando todo de un tirón.
 *
 * @param {number} cantidad - cuántos personajes generar (entre 1 y 1000)
 */
function generarPersonajesMasivo(cantidad) {
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 1000) {
        alert("Ingresá un número entero entre 1 y 1000.");
        return;
    }

    // Precargamos todos los ids ya usados en un Set para que crearAvatarSinEfectosUI
    // pueda chequear duplicados en O(1) en vez de recorrer todo el array cada vez.
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

    /**
     * Procesa un lote de hasta 50 personajes y se vuelve a llamar a sí misma
     * (vía setTimeout) hasta completar la cantidad total pedida.
     */
    function procesarLote() {
        const limiteLote = Math.min(tamanoLote, cantidad - generados);

        for (let i = 0; i < limiteLote; i++) {
            const indiceGlobal = generados;
            const elemento = elegirAleatorio(ELEMENTOS_DISPONIBLES);
            const alias = elegirAleatorio(ALIAS_POR_ELEMENTO[elemento]);
            const nombre = generarNombreUnico(indiceGlobal);
            // Acá es donde se instancia cada personaje del lote: new Avatar(...)
            // dentro de crearAvatarSinEfectosUI.
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
            // Todavía falta generar más: programamos el siguiente lote y
            // cortamos acá para dejar que el navegador respire un instante.
            setTimeout(procesarLote, 0);
            return;
        }

        // Ya se generaron todos: restauramos la UI y refrescamos el juego.
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

// Deja el texto del botón correcto ni bien carga la página (por si el input
// ya tiene un valor por defecto distinto de 50).
actualizarTextoBotonMasivo();