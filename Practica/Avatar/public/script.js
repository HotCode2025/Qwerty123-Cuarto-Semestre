// =============================================================================
// CLASE AVATAR — Template POO para generar personajes del juego
// Cada instancia es un objeto con sus propias propiedades y comportamiento.
// =============================================================================

class Avatar {
    /**
     * Constructor: define la "firma" de todo personaje del juego.
     * Con este único template podemos generar 10, 100 o 1000 personajes distintos.
     *
     * @param {string} id          - Identificador único (ej: "zuko")
     * @param {string} nombre      - Nombre visible en pantalla
     * @param {string} rutaImagen  - Ruta relativa a la imagen del personaje
     * @param {string} elemento    - Elemento dominado: "fuego" | "agua" | "aire" | "tierra"
     * @param {string} alias       - Subtítulo descriptivo (ej: "Maestro Fuego")
     */
    constructor(id, nombre, rutaImagen, elemento, alias) {
        this.id       = id;
        this.nombre   = nombre;
        this.imagen   = rutaImagen;
        this.elemento = elemento;
        this.alias    = alias;
        this.vidas    = 3;  // Todos los personajes comienzan con 3 vidas

        // Cada personaje hereda los ataques correspondientes a su elemento
        // Esto se asigna automáticamente desde el catálogo de ataques
        this.ataques  = Avatar.ATAQUES_POR_ELEMENTO[elemento] ?? Avatar.ATAQUES_POR_ELEMENTO["tierra"];
    }

    // -------------------------------------------------------------------------
    // MÉTODO DE INSTANCIA: lógica propia de cada objeto Avatar
    // -------------------------------------------------------------------------

    /**
     * Verifica si el personaje sigue en combate.
     * @returns {boolean}
     */
    estaVivo() {
        return this.vidas > 0;
    }

    /**
     * Aplica un daño al personaje (descuenta una vida).
     */
    recibirDanio() {
        if (this.estaVivo()) this.vidas--;
    }

    /**
     * Elige un ataque aleatorio de los disponibles para este personaje.
     * @returns {string} Nombre del ataque elegido
     */
    elegirAtaqueAleatorio() {
        const indice = Math.floor(Math.random() * this.ataques.length);
        return this.ataques[indice].id;
    }

    // -------------------------------------------------------------------------
    // PROPIEDADES ESTÁTICAS: datos compartidos por TODOS los Avatares
    // Son del "plano" (clase), no de cada objeto individual.
    // -------------------------------------------------------------------------

    /**
     * Catálogo de ataques por elemento.
     * Añadir un nuevo elemento aquí lo hace disponible automáticamente
     * para cualquier personaje que tenga ese elemento asignado.
     */
    static ATAQUES_POR_ELEMENTO = {
        fuego:  [
            { id: "puño",    label: "Puño 👊",   clase: "fuego"  },
            { id: "patada",  label: "Patada 🦶",  clase: "fuego"  },
            { id: "barrida", label: "Barrida 🧹", clase: "fuego"  },
        ],
        agua:   [
            { id: "puño",    label: "Ola 🌊",     clase: "agua"   },
            { id: "patada",  label: "Torbellino 💧", clase: "agua" },
            { id: "barrida", label: "Hielo 🧊",   clase: "agua"   },
        ],
        aire:   [
            { id: "puño",    label: "Ráfaga 🌪️",  clase: "aire"   },
            { id: "patada",  label: "Torbellino 🌀", clase: "aire" },
            { id: "barrida", label: "Barrida 🧹", clase: "aire"   },
        ],
        tierra: [
            { id: "puño",    label: "Roca 🪨",    clase: "tierra" },
            { id: "patada",  label: "Sismo 🌋",   clase: "tierra" },
            { id: "barrida", label: "Barrida 🧹", clase: "tierra" },
        ],
    };

    /**
     * Tabla de ventajas de combate (sistema piedra-papel-tijeras).
     * La CLAVE le gana al VALOR.
     *   puño    > barrida  (el puño interrumpe la agachada)
     *   patada  > puño     (la patada tiene más alcance)
     *   barrida > patada   (la barrida derriba la patada alta)
     */
    static VENTAJAS = {
        puño:    "barrida",
        patada:  "puño",
        barrida: "patada",
    };

    // -------------------------------------------------------------------------
    // MÉTODO ESTÁTICO DE FÁBRICA: genera personajes desde datos crudos
    // -------------------------------------------------------------------------

    /**
     * Recibe un array de objetos de datos y devuelve un array de instancias Avatar.
     * Esto es lo que permite escalar a 100, 1000 o los personajes que sean,
     * sin repetir código — solo agregás una línea al catálogo de datos.
     *
     * @param {Array} datos - Array de objetos con { id, nombre, imagen, elemento, alias }
     * @returns {Avatar[]}
     */
    static generarDesdedatos(datos) {
        return datos.map(d => new Avatar(d.id, d.nombre, d.imagen, d.elemento, d.alias));
    }
}


// =============================================================================
// CATÁLOGO DE PERSONAJES
// Para agregar un personaje nuevo: una sola línea aquí abajo.
// La clase Avatar se encarga del resto automáticamente.
// =============================================================================

const CATALOGO_PERSONAJES = [
    { id: "zuko",   nombre: "Zuko",   imagen: "./imagenes/Zuko.jpg",   elemento: "fuego",  alias: "Maestro Fuego"   },
    { id: "katara", nombre: "Katara", imagen: "./imagenes/Katara.jpg", elemento: "agua",   alias: "Maestra Agua"    },
    { id: "aang",   nombre: "Aang",   imagen: "./imagenes/Ang.jpg",    elemento: "aire",   alias: "Avatar (Aire)"   },
    { id: "toph",   nombre: "Toph",   imagen: "./imagenes/toph.jpg",   elemento: "tierra", alias: "Maestra Tierra"  },
    // Para agregar más personajes, simplemente añadí líneas aquí:
    // { id: "sokka", nombre: "Sokka", imagen: "./imagenes/Sokka.jpg", elemento: "agua", alias: "Guerrero del Agua" },
];

// Generación dinámica: Avatar.generarDesdedatos() instancia un objeto por cada entrada
const personajesDisponibles = Avatar.generarDesdedatos(CATALOGO_PERSONAJES);

// Variables de estado de la partida actual
let jugador;
let enemigo;


// IDs de las 4 tarjetas decorativas fijas en el HTML
const IDS_ORIGINALES = ["zuko", "katara", "aang", "toph"];

// Cantidad mínima (exclusiva) de personajes para mostrar el filtro en cascada
const UMBRAL_MOSTRAR_FILTRO = 8;


// =============================================================================
// RENDERIZADO DEL DROPDOWN DE SELECCIÓN
// Las 4 tarjetas originales son solo visuales; la elección real sale del <select>.
// =============================================================================

/**
 * Reconstruye las <option> del select a partir de una lista dada,
 * conservando el placeholder de value="".
 */
function poblarOpcionesSelect(lista) {
    const select = document.getElementById('select-personaje');
    if (!select) return;

    Array.from(select.options).forEach(opcion => {
        if (opcion.value !== "") opcion.remove();
    });

    lista.forEach(personaje => {
        const opcion = document.createElement("option");
        opcion.value = personaje.id;
        opcion.textContent = `${personaje.nombre} — ${personaje.alias}`;
        select.appendChild(opcion);
    });
}

function renderizarPersonajes(idSeleccionado) {
    const select = document.getElementById('select-personaje');
    if (!select) return; // Seguridad: si el DOM no está listo, no rompe

    poblarOpcionesSelect(personajesDisponibles);

    if (idSeleccionado && personajesDisponibles.some(p => p.id === idSeleccionado)) {
        select.value = idSeleccionado;
    } else {
        select.value = "";
    }

    actualizarTarjetaActiva();
    renderizarEmojisEnTarjetas();
}

/**
 * Inyecta el emoji del elemento encima de cada tarjeta original.
 * Los personajes custom sin elemento no reciben badge.
 */
function renderizarEmojisEnTarjetas() {
    document.querySelectorAll(".tarjeta-personaje").forEach(tarjeta => {
        const personaje = personajesDisponibles.find(p => p.id === tarjeta.dataset.personaje);

        tarjeta.querySelectorAll(".emoji-elemento").forEach(badge => badge.remove());

        if (!personaje?.elemento) return;

        tarjeta.dataset.elemento = personaje.elemento;

        const badge = document.createElement("span");
        badge.className = `emoji-elemento emoji-${personaje.elemento}`;
        badge.textContent = EMOJI_POR_ELEMENTO[personaje.elemento] ?? "";
        tarjeta.prepend(badge);
    });
}

/**
 * Resalta la tarjeta original que coincide con el dropdown.
 * Si el elegido es un personaje creado, ninguna tarjeta queda activa.
 */
function actualizarTarjetaActiva() {
    const select = document.getElementById('select-personaje');
    const idSeleccionado = select ? select.value : "";

    document.querySelectorAll('.tarjeta-personaje').forEach(tarjeta => {
        const esActiva = tarjeta.dataset.personaje === idSeleccionado
            && IDS_ORIGINALES.includes(idSeleccionado);
        tarjeta.classList.toggle('activo', esActiva);
    });
}


// =============================================================================
// REFERENCIAS AL DOM
// =============================================================================

const seccionSeleccionar = document.getElementById('seccion-seleccionar');
const seccionCombate     = document.getElementById('seccion-combate');
const seccionMensajes    = document.getElementById('seccion-mensajes');
const seccionReiniciar   = document.getElementById('seccion-reiniciar');

const btnPersonaje  = document.getElementById('btn-personaje');
const btnReiniciar  = document.getElementById('btn-reiniciar');
const textoResultado = document.getElementById('texto-resultado');

const visualJugador = document.getElementById('visual-jugador');
const visualEnemigo = document.getElementById('visual-enemigo');
const vidasJugador  = document.getElementById('vidas-jugador');
const vidasEnemigo  = document.getElementById('vidas-enemigo');
const barraJ        = document.getElementById('barra-j');
const barraE        = document.getElementById('barra-e');
const nombreJugadorPantalla = document.getElementById('nombre-jugador-pantalla');
const nombreEnemigoPantalla = document.getElementById('nombre-enemigo-pantalla');

// Botones de ataque (siempre presentes en el HTML)
document.getElementById('btn-puño').addEventListener('click',    () => procesarTurno('puño'));
document.getElementById('btn-patada').addEventListener('click',  () => procesarTurno('patada'));
document.getElementById('btn-barrida').addEventListener('click', () => procesarTurno('barrida'));

btnPersonaje.addEventListener('click', seleccionarPersonajeJugador);
btnReiniciar.addEventListener('click', volverAJugar);

document.getElementById('btn-reiniciar-todo').addEventListener('click', reiniciarTodo);

const selectPersonaje = document.getElementById('select-personaje');
selectPersonaje.addEventListener('change', actualizarTarjetaActiva);

// Permite seleccionar haciendo clic directamente en la tarjeta del personaje
document.getElementById('contenedor-tarjetas').addEventListener('click', (e) => {
    const tarjeta = e.target.closest('.tarjeta-personaje');
    if (!tarjeta) return;

    const id = tarjeta.dataset.personaje;
    // Solo si ese personaje sigue disponible en el catálogo
    if (personajesDisponibles.some(p => p.id === id)) {
        selectPersonaje.value = id;
        actualizarTarjetaActiva();
    }
});

const filtroElemento = document.getElementById('filtro-elemento');
const filtroAlias = document.getElementById('filtro-alias');
const contadorResultados = document.getElementById('contador-resultados');

/**
 * Repuebla #filtro-alias según el elemento elegido.
 * Con "Todos", une todos los alias de ALIAS_POR_ELEMENTO sin duplicados.
 */
function poblarSelectAlias(elemento) {
    if (!filtroAlias) return;

    filtroAlias.innerHTML = "";
    const opcionTodos = document.createElement("option");
    opcionTodos.value = "";
    opcionTodos.textContent = "Todos";
    filtroAlias.appendChild(opcionTodos);

    let aliasLista = [];
    if (!elemento) {
        const unidos = new Set();
        ELEMENTOS_DISPONIBLES.forEach(el => {
            (ALIAS_POR_ELEMENTO[el] || []).forEach(alias => unidos.add(alias));
        });
        aliasLista = Array.from(unidos);
    } else {
        aliasLista = ALIAS_POR_ELEMENTO[elemento] || [];
    }

    aliasLista.forEach(alias => {
        const opcion = document.createElement("option");
        opcion.value = alias;
        opcion.textContent = alias;
        filtroAlias.appendChild(opcion);
    });

    filtroAlias.value = "";
}

/**
 * Aplica los filtros de elemento/alias sobre el dropdown de personajes.
 * No toca las tarjetas fijas.
 */
function aplicarFiltroPersonajes() {
    const elemento = filtroElemento ? filtroElemento.value : "";
    const alias = filtroAlias ? filtroAlias.value : "";
    const select = document.getElementById('select-personaje');

    const listaFiltrada = personajesDisponibles.filter(p => {
        const okElemento = !elemento || p.elemento === elemento;
        const okAlias = !alias || p.alias === alias;
        return okElemento && okAlias;
    });

    poblarOpcionesSelect(listaFiltrada);

    if (contadorResultados) {
        if (listaFiltrada.length === 0) {
            contadorResultados.textContent = "Sin resultados";
            contadorResultados.classList.add("sin-resultados");
        } else {
            contadorResultados.textContent =
                `${listaFiltrada.length} personaje(s) encontrado(s)`;
            contadorResultados.classList.remove("sin-resultados");
        }
    }

    if (listaFiltrada.length === 1) {
        select.value = listaFiltrada[0].id;
    } else {
        select.value = "";
    }
}

/**
 * Muestra u oculta el panel de filtros según la cantidad de personajes.
 * Por debajo del umbral, fuerza "Todos" y la lista completa en el select.
 */
function actualizarVisibilidadFiltro() {
    const panelFiltros = document.getElementById('panel-filtros');
    if (!panelFiltros) return;

    if (personajesDisponibles.length > UMBRAL_MOSTRAR_FILTRO) {
        panelFiltros.style.display = "";
        return;
    }

    panelFiltros.style.display = "none";
    resetearFiltrosCascada();

    const select = document.getElementById('select-personaje');
    const idActual = select ? select.value : "";
    poblarOpcionesSelect(personajesDisponibles);

    if (idActual && personajesDisponibles.some(p => p.id === idActual)) {
        select.value = idActual;
    } else if (select) {
        select.value = "";
    }
}

/** Resetea los filtros en cascada a "Todos" y repuebla alias + contador. */
function resetearFiltrosCascada() {
    if (filtroElemento) filtroElemento.value = "";
    poblarSelectAlias("");
    if (filtroAlias) filtroAlias.value = "";
}

filtroElemento.addEventListener('change', () => {
    poblarSelectAlias(filtroElemento.value);
    aplicarFiltroPersonajes();
});

filtroAlias.addEventListener('change', aplicarFiltroPersonajes);


// =============================================================================
// MODAL DE REGLAS
// =============================================================================

const modalReglas       = document.getElementById('modal-reglas');
const btnCerrarReglas   = document.getElementById('btn-cerrar-reglas');

document.getElementById('show-rules').addEventListener('click', () =>
    modalReglas.classList.add('activo'));

document.getElementById('show-rules-combat').addEventListener('click', () =>
    modalReglas.classList.add('activo'));

btnCerrarReglas.addEventListener('click', () =>
    modalReglas.classList.remove('activo'));

modalReglas.addEventListener('click', e => {
    if (e.target === modalReglas) modalReglas.classList.remove('activo');
});


// =============================================================================
// SELECCIÓN DE PERSONAJE Y PREPARACIÓN DE LA ARENA
// =============================================================================

function seleccionarPersonajeJugador() {
    const seleccionID = document.getElementById('select-personaje').value;

    if (!seleccionID) {
        alert("¡Debes elegir un maestro antes de ir a la arena!");
        return;
    }

    // Crear instancias frescas (vidas reseteadas) a partir del catálogo
    const baseJ = personajesDisponibles.find(p => p.id === seleccionID);
    if (!baseJ) {
        alert("¡Debes elegir un maestro antes de ir a la arena!");
        return;
    }
    jugador = new Avatar(baseJ.id, baseJ.nombre, baseJ.imagen, baseJ.elemento, baseJ.alias);

    // Enemigo aleatorio (puede repetirse; es parte del juego)
    const baseE = personajesDisponibles[Math.floor(Math.random() * personajesDisponibles.length)];
    enemigo = new Avatar(baseE.id, baseE.nombre, baseE.imagen, baseE.elemento, baseE.alias);

    prepararPantallaArena();
}

/**
 * En la arena: foto si hay ruta de imagen; si no, emoji del elemento.
 */
function renderizarSprite(contenedor, personaje) {
    const sprite = contenedor.querySelector('.sprite');
    if (personaje.imagen) {
        sprite.innerHTML =
            `<img src="${personaje.imagen}" alt="${personaje.nombre}" class="foto-render">`;
    } else {
        const emoji = (typeof EMOJI_POR_ELEMENTO !== "undefined")
            ? (EMOJI_POR_ELEMENTO[personaje.elemento] || "✨")
            : "✨";
        sprite.textContent = emoji;
    }
}

function prepararPantallaArena() {
    seccionSeleccionar.classList.add('oculto');
    const seccionCrear = document.getElementById('seccion-crear');
    if (seccionCrear) seccionCrear.classList.add('oculto');
    seccionCombate.classList.remove('oculto');
    seccionMensajes.classList.remove('oculto');
    seccionReiniciar.classList.remove('oculto');

    // Reset visual de vidas/barras al entrar a la arena
    textoResultado.innerHTML = "¡La batalla ha comenzado!";
    vidasJugador.textContent = jugador.vidas;
    vidasEnemigo.textContent = enemigo.vidas;
    barraJ.style.width = "100%";
    barraE.style.width = "100%";
    barraJ.style.backgroundColor = "#22c55e";
    barraE.style.backgroundColor = "#22c55e";

    // Render de foto o emoji según el personaje
    renderizarSprite(visualJugador, jugador);
    nombreJugadorPantalla.textContent = jugador.nombre;

    renderizarSprite(visualEnemigo, enemigo);
    nombreEnemigoPantalla.textContent = enemigo.nombre + " (Rival)";

    // Actualizar etiquetas de los botones de ataque según el elemento del jugador
    jugador.ataques.forEach((ataque, i) => {
        const ids = ['btn-puño', 'btn-patada', 'btn-barrida'];
        const btn = document.getElementById(ids[i]);
        if (btn) {
            btn.textContent = ataque.label;
            // Reemplazar clases de color previas
            btn.className = `btn-ataque ${ataque.clase}`;
        }
    });
}

/**
 * Sale del combate sin recargar la página y sin tocar el catálogo.
 * Preselecciona el mismo personaje del jugador para una revancha rápida.
 */
function volverAJugar() {
    const idJugadorActual = jugador ? jugador.id : "";

    jugador = undefined;
    enemigo = undefined;

    vidasJugador.textContent = "3";
    vidasEnemigo.textContent = "3";
    barraJ.style.width = "100%";
    barraE.style.width = "100%";
    barraJ.style.backgroundColor = "#22c55e";
    barraE.style.backgroundColor = "#22c55e";
    textoResultado.innerHTML = "¡La batalla ha comenzado!";

    visualJugador.classList.remove('ataque-jugador', 'recibir-daño');
    visualEnemigo.classList.remove('ataque-enemigo', 'recibir-daño');

    seccionCombate.classList.add('oculto');
    seccionMensajes.classList.add('oculto');
    seccionReiniciar.classList.add('oculto');

    const seccionCrear = document.getElementById('seccion-crear');
    if (seccionCrear) seccionCrear.classList.add('oculto');

    resetearFiltrosCascada();

    seccionSeleccionar.classList.remove('oculto');
    renderizarPersonajes(idJugadorActual);
    if (contadorResultados) {
        contadorResultados.textContent =
            `${personajesDisponibles.length} personaje(s) encontrado(s)`;
    }
}

/**
 * Restaura el catálogo a los 4 originales (acción destructiva).
 * Mutamos el array const in-place para conservar la misma referencia global.
 */
function reiniciarTodo() {
    const confirmar = confirm(
        "¿Reiniciar el catálogo? Se perderán todos los personajes generados."
    );
    if (!confirmar) return;

    personajesDisponibles.length = 0;
    personajesDisponibles.push(...Avatar.generarDesdedatos(CATALOGO_PERSONAJES));

    resetearFiltrosCascada();
    renderizarPersonajes();
    aplicarFiltroPersonajes();
    actualizarVisibilidadFiltro();
}


// =============================================================================
// LÓGICA DE COMBATE
// =============================================================================

function procesarTurno(ataqueJugador) {
    if (!jugador.estaVivo() || !enemigo.estaVivo()) return;

    // El enemigo usa el método de instancia de su propio objeto
    const ataqueEnemigo = enemigo.elegirAtaqueAleatorio();

    // Animaciones de ataque
    visualJugador.classList.add('ataque-jugador');
    visualEnemigo.classList.add('ataque-enemigo');
    setTimeout(() => {
        visualJugador.classList.remove('ataque-jugador');
        visualEnemigo.classList.remove('ataque-enemigo');
    }, 200);

    const labelJ = jugador.ataques.find(a => a.id === ataqueJugador)?.label ?? ataqueJugador.toUpperCase();
    const labelE = enemigo.ataques.find(a => a.id === ataqueEnemigo)?.label ?? ataqueEnemigo.toUpperCase();

    // Resolución usando la tabla estática de ventajas de la clase Avatar
    if (ataqueJugador === ataqueEnemigo) {
        textoResultado.innerHTML =
            `Lanzaste <strong>${labelJ}</strong>. El rival respondió con <strong>${labelE}</strong>.<br>
             💥 ¡Choque de guardias! Las fuerzas están niveladas.`;

    } else if (Avatar.VENTAJAS[ataqueJugador] === ataqueEnemigo) {
        enemigo.recibirDanio();   // método de instancia del objeto enemigo
        visualEnemigo.classList.add('recibir-daño');
        setTimeout(() => visualEnemigo.classList.remove('recibir-daño'), 400);
        textoResultado.innerHTML =
            `¡Tu <strong>${labelJ}</strong> conectó contra la <strong>${labelE}</strong> del rival!<br>
             🏆 ¡Impacto limpio! El rival pierde una vida.`;

    } else {
        jugador.recibirDanio();   // método de instancia del objeto jugador
        visualJugador.classList.add('recibir-daño');
        setTimeout(() => visualJugador.classList.remove('recibir-daño'), 400);
        textoResultado.innerHTML =
            `Tu <strong>${labelJ}</strong> fue anticipado por la <strong>${labelE}</strong> del rival.<br>
             💀 ¡Te contragolpearon! Perdiste una vida.`;
    }

    actualizarInterfazVidas();
    verificarEstadoFinal();
}

function actualizarInterfazVidas() {
    vidasJugador.textContent = jugador.vidas;
    vidasEnemigo.textContent = enemigo.vidas;

    barraJ.style.width = `${(jugador.vidas / 3) * 100}%`;
    barraE.style.width = `${(enemigo.vidas / 3) * 100}%`;

    if (jugador.vidas === 1) barraJ.style.backgroundColor = "#ef4444";
    if (enemigo.vidas === 1) barraE.style.backgroundColor = "#ef4444";
}

function verificarEstadoFinal() {
    if (!jugador.estaVivo() || !enemigo.estaVivo()) {
        if (!jugador.estaVivo() && !enemigo.estaVivo()) {
            textoResultado.innerHTML = "🏁 <strong>¡MUTUO K.O.! Ambos guerreros han caído.</strong>";
        } else if (!jugador.estaVivo()) {
            textoResultado.innerHTML = "❌ <strong>¡Derrota! Te quedaste sin energía espiritual.</strong>";
        } else {
            textoResultado.innerHTML = "👑 <strong>¡VICTORIA! Sos el verdadero maestro elemental.</strong>";
        }
    }
}

// Cargar el dropdown al iniciar (las tarjetas originales ya están en el HTML)
resetearFiltrosCascada();
renderizarPersonajes();
aplicarFiltroPersonajes();
actualizarVisibilidadFiltro();