// =============================================================================
// SCRIPT.JS — Lógica principal del juego "AVATAR: Combate Elemental"
// -----------------------------------------------------------------------------
// Este archivo contiene:
//   1) La clase Avatar (el corazón de la Programación Orientada a Objetos
//      del proyecto).
//   2) El catálogo de personajes y el estado global de la partida.
//   3) Todas las funciones que conectan la clase Avatar con el HTML:
//      renderizado de tarjetas/dropdown, filtros, combate, reinicio, etc.
//
// IMPORTANTE:
// La POO vive ACÁ (en la clase Avatar). 
// El resto del código es "procedimental" y se encarga de la interacción
// con el DOM y la lógica de juego. No se mezclan responsabilidades: la clase
// no sabe nada de HTML, y las funciones del resto del archivo no tocan
// directamente los datos internos de un Avatar (solo llaman a sus métodos).
// =============================================================================

// =============================================================================
// CLASE AVATAR — Template POO para generar personajes del juego
// Cada instancia es un objeto con sus propias propiedades y comportamiento.
//
// Pilares de POO presentes en esta clase:
//   - ABSTRACCIÓN / ENCAPSULAMIENTO: todos los datos de un personaje
//     (vidas, ataques, elemento, etc.) viven agrupados DENTRO del objeto,
//     en vez de sueltos en variables globales.
//   - INSTANCIACIÓN: cada personaje del juego (Zuko, Katara, uno creado a
//     mano, uno aleatorio, uno de la generación masiva) es un "new Avatar(...)"
//     distinto, con sus propios valores.
//   - MÉTODOS DE INSTANCIA: comportamiento que le pertenece a CADA objeto
//     (estaVivo, recibirDanio, elegirAtaqueAleatorio) y que actúa sobre
//     sus propios datos vía "this".
//   - MÉTODOS ESTÁTICOS: datos y funciones que pertenecen a la CLASE en
//     general (no a un personaje puntual), como la tabla de ataques por
//     elemento o el método de fábrica que genera varios Avatar de una.
// =============================================================================

class Avatar {
    /**
     * CONSTRUCTOR: define la "firma" de todo personaje del juego.
     * Se ejecuta automáticamente cada vez que hacemos "new Avatar(...)".
     * Con este único template podemos generar 10, 100 o 1000 personajes distintos,
     * cada uno con sus propios valores pero compartiendo la misma estructura.
     *
     * @param {string} id          - Identificador único (ej: "zuko")
     * @param {string} nombre      - Nombre visible en pantalla
     * @param {string} rutaImagen  - Ruta relativa a la imagen del personaje
     *                               (si viene vacía, en la arena se usa un
     *                               emoji del elemento en su lugar)
     * @param {string} elemento    - Elemento dominado: "fuego" | "agua" | "aire" | "tierra"
     * @param {string} alias       - Subtítulo descriptivo (ej: "Maestro Fuego")
     * @param {string} fotoMapa    - Imagen que se dibuja en el mapa (canvas)
     * @param {number} [x=10]      - Posición horizontal inicial en el mapa
     * @param {number} [y=10]      - Posición vertical inicial en el mapa
     */
    constructor(id, nombre, rutaImagen, elemento, alias, fotoMapa, x = 10, y = 10) {
        // "this" apunta al objeto puntual que se está creando en este momento.
        // Guardamos cada parámetro recibido como una propiedad propia del objeto.
        this.id       = id;
        this.nombre   = nombre;
        this.imagen   = rutaImagen;
        this.elemento = elemento;
        this.alias    = alias;
        this.vidas    = 3;  // Todos los personajes comienzan con 3 vidas

        // Cada personaje "hereda" (en el sentido de juego, no de POO) los
        // ataques correspondientes a su elemento. Se asigna automáticamente
        // leyendo el catálogo estático de la propia clase (Avatar.ATAQUES_POR_ELEMENTO).
        // Si el elemento no existe en el catálogo, usamos "tierra" como resguardo
        // para que el juego nunca se rompa por datos faltantes.
        // Usamos una COPIA del array ([...]) para que, si a un personaje se le
        // agregan ataques (como a los enemigos del mapa), no se modifique el
        // catálogo compartido por todos los del mismo elemento.
        this.ataques  = [...(Avatar.ATAQUES_POR_ELEMENTO[elemento] ?? Avatar.ATAQUES_POR_ELEMENTO["tierra"])];

        // Posición y tamaño del personaje dentro del mapa (canvas).
        // x e y llegan por parámetro (por defecto 10) y se actualizan al moverse.
        this.x     = x;
        this.y     = y;
        this.ancho = 80;
        this.alto  = 80;

        // Imagen que se dibuja en el mapa (si el personaje tiene foto)
        this.mapaFoto = new Image();
        // Todos miden lo mismo de alto; el ancho se calcula cuando carga la
        // imagen, según su proporción, para que el personaje no se deforme.
        this.mapaFoto.onload = () => {
            this.ancho = Math.round(this.alto * this.mapaFoto.naturalWidth / this.mapaFoto.naturalHeight);
        };
        if (fotoMapa) this.mapaFoto.src = fotoMapa;

        // Velocidad de movimiento: mientras sea distinta de 0, el personaje
        // se sigue desplazando en cada repintado del mapa.
        this.velocidadX = 0;
        this.velocidadY = 0;
    }

    /**
     * Dibuja al personaje dentro del mapa usando su propia posición y tamaño.
     * Si no tiene foto (personaje creado a mano), dibuja un rectángulo.
     */
    pintarAvatares() {
        if (!this.mapaFoto.src) {
            lienzo.fillRect(this.x, this.y, this.ancho, this.alto);
            return;
        }

        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        );
    }

    // -------------------------------------------------------------------------
    // MÉTODOS DE INSTANCIA: lógica propia de cada objeto Avatar.
    // Cada personaje que creamos con "new Avatar(...)" tiene acceso a estos
    // métodos y los ejecuta sobre SUS PROPIOS datos (this.vidas, this.ataques).
    // Por ejemplo: jugador.recibirDanio() solo descuenta la vida del jugador,
    // nunca la del enemigo, porque "this" dentro del método es ese objeto puntual.
    // -------------------------------------------------------------------------

    /**
     * Verifica si el personaje sigue en combate.
     * @returns {boolean} true si le queda al menos 1 vida
     */
    estaVivo() {
        return this.vidas > 0;
    }

    /**
     * Aplica un daño al personaje (descuenta una vida).
     * No hace nada si el personaje ya está sin vidas, para evitar valores negativos.
     */
    recibirDanio() {
        if (this.estaVivo()) this.vidas--;
    }

    /**
     * Elige un ataque aleatorio de los disponibles para este personaje.
     * Usa this.ataques, que se calculó en el constructor según el elemento.
     * @returns {string} id del ataque elegido ("puño" | "patada" | "barrida")
     */
    elegirAtaqueAleatorio() {
        const indice = Math.floor(Math.random() * this.ataques.length);
        return this.ataques[indice].id;
    }

    // -------------------------------------------------------------------------
    // PROPIEDADES ESTÁTICAS: datos compartidos por TODOS los Avatares.
    // Son del "plano" (la clase en sí), no de cada objeto individual.
    // Por eso se accede con "Avatar.ATAQUES_POR_ELEMENTO", no con
    // "miPersonaje.ATAQUES_POR_ELEMENTO" — no hace falta tener un objeto
    // creado para consultarlas.
    // -------------------------------------------------------------------------

    /**
     * Catálogo de ataques por elemento.
     * Añadir un nuevo elemento aquí lo hace disponible automáticamente
     * para cualquier personaje que tenga ese elemento asignado (ver constructor).
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
     * Se usa en procesarTurno() para decidir quién gana cada intercambio.
     */
    static VENTAJAS = {
        puño:    "barrida",
        patada:  "puño",
        barrida: "patada",
    };

    // -------------------------------------------------------------------------
    // MÉTODO ESTÁTICO DE FÁBRICA: genera varios personajes desde datos crudos.
    // Se llama sobre la clase ("Avatar.generarDesdedatos(...)"), no sobre
    // un objeto puntual, porque su trabajo es justamente CREAR objetos nuevos.
    // -------------------------------------------------------------------------

    /**
     * Recibe un array de objetos de datos simples (planos, sin comportamiento)
     * y devuelve un array de instancias reales de Avatar (con sus métodos y
     * su propio estado). Esto es lo que permite escalar a 100, 1000 o los
     * personajes que sean, sin repetir código — solo agregás una línea al
     * catálogo de datos (CATALOGO_PERSONAJES, más abajo) y esta función se
     * encarga de "instanciar" (hacer new Avatar) por cada uno.
     *
     * @param {Array} datos - Array de objetos con { id, nombre, imagen, elemento, alias }
     * @returns {Avatar[]} Array de instancias de Avatar, listas para usar
     */
    static generarDesdedatos(datos) {
        return datos.map(d => new Avatar(d.id, d.nombre, d.imagen, d.elemento, d.alias, d.fotoMapa));
    }
}


// =============================================================================
// CATÁLOGO DE PERSONAJES (datos crudos, todavía NO son objetos Avatar)
// Para agregar un personaje fijo nuevo: una sola línea aquí abajo.
// La clase Avatar se encarga de instanciarlo automáticamente
// (ver Avatar.generarDesdedatos, justo debajo de este catálogo).
// =============================================================================

const CATALOGO_PERSONAJES = [
    // fotoMapa: versión sin fondo (PNG) que se dibuja en el mapa
    { id: "zuko",   nombre: "Zuko",   imagen: "./imagenes/Zuko.jpg",   fotoMapa: "./imagenes/mapa/Zuko.png",   elemento: "fuego",  alias: "Maestro Fuego"   },
    { id: "katara", nombre: "Katara", imagen: "./imagenes/Katara.jpg", fotoMapa: "./imagenes/mapa/Katara.png", elemento: "agua",   alias: "Maestra Agua"    },
    { id: "aang",   nombre: "Aang",   imagen: "./imagenes/Ang.jpg",    fotoMapa: "./imagenes/mapa/Ang.png",    elemento: "aire",   alias: "Avatar (Aire)"   },
    { id: "toph",   nombre: "Toph",   imagen: "./imagenes/toph.jpg",   fotoMapa: "./imagenes/mapa/toph.png",   elemento: "tierra", alias: "Maestra Tierra"  },
    // Para agregar más personajes, simplemente añadí líneas aquí:
    // { id: "sokka", nombre: "Sokka", imagen: "./imagenes/Sokka.jpg", elemento: "agua", alias: "Guerrero del Agua" },
];

// GENERACIÓN DINÁMICA: Avatar.generarDesdedatos() instancia un objeto Avatar
// por cada entrada del catálogo. A partir de esta línea, "personajesDisponibles"
// ya NO son datos sueltos: son objetos reales con métodos (estaVivo, etc.).
// Este array se sigue modificando durante toda la partida (push cuando se crea
// un personaje nuevo, reset cuando se reinicia el catálogo).
const personajesDisponibles = Avatar.generarDesdedatos(CATALOGO_PERSONAJES);

// =============================================================================
// ENEMIGOS DEL MAPA
// Son los personajes que se dibujan quietos en el mapa. Al chocar con uno de
// ellos, ese pasa a ser el rival del combate. Lo único que cambia respecto
// de los personajes del catálogo es su posición (x, y) dentro del canvas.
// =============================================================================

let zukoEnemigo   = new Avatar("zuko",   "Zuko",   "./imagenes/Zuko.jpg",   "fuego",  "Maestro Fuego",  "./imagenes/mapa/Zuko.png",   120, 170);
let kataraEnemigo = new Avatar("katara", "Katara", "./imagenes/Katara.jpg", "agua",   "Maestra Agua",   "./imagenes/mapa/Katara.png", 220, 130);
let aangEnemigo   = new Avatar("aang",   "Aang",   "./imagenes/Ang.jpg",    "aire",   "Avatar (Aire)",  "./imagenes/mapa/Ang.png",    280, 255);
let tophEnemigo   = new Avatar("toph",   "Toph",   "./imagenes/toph.jpg",   "tierra", "Maestra Tierra", "./imagenes/mapa/toph.png",   320, 150);

// Cada enemigo suma ataques extra para tener un ataque favorito: al elegir al
// azar entre más copias de un mismo ataque, es más probable que lo use.
// Posiciones en ATAQUES_POR_ELEMENTO: [0] = puño, [1] = patada, [2] = barrida
const ataquesFuego  = Avatar.ATAQUES_POR_ELEMENTO.fuego;
const ataquesAgua   = Avatar.ATAQUES_POR_ELEMENTO.agua;
const ataquesAire   = Avatar.ATAQUES_POR_ELEMENTO.aire;
const ataquesTierra = Avatar.ATAQUES_POR_ELEMENTO.tierra;

zukoEnemigo.ataques.push(   // favorito: puño
    ataquesFuego[0],
    ataquesFuego[0],
    ataquesFuego[0],
    ataquesFuego[1],
    ataquesFuego[2],
);

kataraEnemigo.ataques.push( // favorito: barrida
    ataquesAgua[2],
    ataquesAgua[2],
    ataquesAgua[2],
    ataquesAgua[1],
    ataquesAgua[0],
);

aangEnemigo.ataques.push(   // favorito: patada
    ataquesAire[1],
    ataquesAire[1],
    ataquesAire[1],
    ataquesAire[0],
    ataquesAire[2],
);

tophEnemigo.ataques.push(   // favorito: puño
    ataquesTierra[0],
    ataquesTierra[0],
    ataquesTierra[0],
    ataquesTierra[1],
    ataquesTierra[2],
);

// Variables de estado de la partida actual.
// Se completan recién cuando el jugador confirma su selección
// (ver seleccionarPersonajeJugador más abajo).
let jugador;
let enemigo;


// IDs de las 4 tarjetas decorativas fijas en el HTML (Zuko, Katara, Aang, Toph).
// Sirven para saber si el personaje elegido en el <select> tiene una tarjeta
// visual asociada, o si es un personaje creado por el usuario (sin tarjeta).
const IDS_ORIGINALES = ["zuko", "katara", "aang", "toph"];

// Cantidad mínima (exclusiva) de personajes para mostrar el panel de filtros
// en cascada (elemento + alias). Con pocos personajes no tiene sentido filtrar.
const UMBRAL_MOSTRAR_FILTRO = 8;


// =============================================================================
// RENDERIZADO DEL DROPDOWN DE SELECCIÓN
// Las 4 tarjetas originales son solo visuales; la elección real que usa el
// juego sale siempre del <select id="select-personaje">.
// =============================================================================

/**
 * Reconstruye las <option> del <select> a partir de una lista de personajes
 * dada, conservando siempre el placeholder ("— Elegí un personaje —",
 * value="").
 * Se reutiliza tanto para mostrar TODOS los personajes como para mostrar
 * una lista ya filtrada (ver aplicarFiltroPersonajes).
 *
 * @param {Avatar[]} lista - Personajes a mostrar como opciones
 */
function poblarOpcionesSelect(lista) {
    const select = document.getElementById('select-personaje');
    if (!select) return;

    // Borramos todas las opciones existentes MENOS el placeholder (value="")
    Array.from(select.options).forEach(opcion => {
        if (opcion.value !== "") opcion.remove();
    });

    // Creamos una <option> nueva por cada personaje de la lista recibida
    lista.forEach(personaje => {
        const opcion = document.createElement("option");
        opcion.value = personaje.id;
        opcion.textContent = `${personaje.nombre} — ${personaje.alias}`;
        select.appendChild(opcion);
    });
}

/**
 * Punto de entrada para "refrescar" toda la pantalla de selección después de
 * un cambio en el catálogo (crear personaje, generación masiva, reinicio, etc.).
 * Repuebla el <select> con TODOS los personajes disponibles, intenta dejar
 * preseleccionado el id recibido (si existe), y actualiza tarjetas + emojis.
 *
 * @param {string} [idSeleccionado] - id que se quiere dejar marcado, si aplica
 */
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
 * Inyecta el emoji del elemento como "badge" encima de cada una de las 4
 * tarjetas fijas del HTML. Los personajes custom (creados por el usuario)
 * no tienen tarjeta propia, así que esto solo afecta a Zuko/Katara/Aang/Toph.
 */
function renderizarEmojisEnTarjetas() {
    document.querySelectorAll(".tarjeta-personaje").forEach(tarjeta => {
        // Buscamos, dentro del array de objetos Avatar, el que coincide con
        // el id guardado en el atributo data-personaje de esta tarjeta.
        const personaje = personajesDisponibles.find(p => p.id === tarjeta.dataset.personaje);

        // Sacamos cualquier badge de emoji que haya quedado de una render anterior
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
 * Resalta con una clase CSS la tarjeta original que coincide con lo elegido
 * en el dropdown. Si el personaje elegido fue creado por el usuario (no tiene
 * tarjeta propia), ninguna tarjeta queda marcada como activa.
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
// Guardamos acá, una sola vez, los elementos HTML que se van a usar en varias
// funciones. Evita repetir document.getElementById(...) por todos lados.
// =============================================================================

const seccionSeleccionar = document.getElementById('seccion-seleccionar');
const seccionCombate     = document.getElementById('seccion-combate');
const seccionMensajes    = document.getElementById('seccion-mensajes');
const seccionReiniciar   = document.getElementById('seccion-reiniciar');

// Mapa de encuentro: sección contenedora y el <canvas> donde se dibuja
const sectionVerMapa = document.getElementById('ver-mapa');
const mapa = document.getElementById('mapa');
let lienzo = mapa.getContext("2d"); // vamos a trabajar en 2 dimensiones
// el lienzo nos permite dibujar dentro del canvas
let intervalo; // guarda el setInterval que repinta el mapa constantemente
let personajeJugadorObjeto; // objeto Avatar del personaje elegido que se mueve en el mapa

// Imagen de fondo del mapa (debe existir en la carpeta imagenes)
let mapaBackground = new Image();
mapaBackground.src = './imagenes/mapa.jpg';

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

// Botones de ataque (siempre presentes en el HTML, uno por cada tipo de ataque)
document.getElementById('btn-puño').addEventListener('click',    () => procesarTurno('puño'));
document.getElementById('btn-patada').addEventListener('click',  () => procesarTurno('patada'));
document.getElementById('btn-barrida').addEventListener('click', () => procesarTurno('barrida'));

btnPersonaje.addEventListener('click', seleccionarPersonajeJugador);
btnReiniciar.addEventListener('click', volverAJugar);

document.getElementById('btn-reiniciar-todo').addEventListener('click', reiniciarTodo);

const selectPersonaje = document.getElementById('select-personaje');
selectPersonaje.addEventListener('change', actualizarTarjetaActiva);

// Permite seleccionar un personaje haciendo clic directamente sobre su tarjeta,
// en vez de tener que abrir el <select> manualmente.
document.getElementById('contenedor-tarjetas').addEventListener('click', (e) => {
    // closest() sube por los elementos padres hasta encontrar la tarjeta,
    // así funciona aunque el clic caiga sobre la imagen o el texto interno.
    const tarjeta = e.target.closest('.tarjeta-personaje');
    if (!tarjeta) return;

    const id = tarjeta.dataset.personaje;
    // Solo si ese personaje sigue disponible en el catálogo (por si se
    // reinició el catálogo y esa tarjeta quedó "huérfana")
    if (personajesDisponibles.some(p => p.id === id)) {
        selectPersonaje.value = id;
        actualizarTarjetaActiva();
    }
});


// =============================================================================
// FILTROS EN CASCADA (elemento → alias)
// Con muchos personajes generados (aleatorios o masivos), el <select> se
// vuelve gigante. Estos filtros permiten acotar la búsqueda por elemento y
// después por alias, sin tocar el array real de personajes (solo cambian
// qué se muestra en el <select>).
// =============================================================================

const filtroElemento = document.getElementById('filtro-elemento');
const filtroAlias = document.getElementById('filtro-alias');
const contadorResultados = document.getElementById('contador-resultados');

/**
 * Repuebla el <select> de alias (#filtro-alias) según el elemento elegido
 * en #filtro-elemento.
 * Con "Todos" (elemento vacío), une todos los alias de ALIAS_POR_ELEMENTO
 * sin duplicados usando un Set.
 *
 * @param {string} elemento - "" para todos, o "fuego"|"agua"|"aire"|"tierra"
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
        // Sin elemento elegido: juntamos los alias de los 4 elementos sin repetir
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
 * Aplica los filtros de elemento/alias sobre el <select> de personajes.
 * Recorre personajesDisponibles con .filter() y solo deja pasar los que
 * cumplen ambas condiciones (si el filtro está vacío, esa condición no cuenta).
 * No toca las tarjetas fijas del HTML, solo el dropdown.
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

    // Si el filtro dejó un único resultado, lo autoseleccionamos para
    // ahorrarle un clic al usuario.
    if (listaFiltrada.length === 1) {
        select.value = listaFiltrada[0].id;
    } else {
        select.value = "";
    }
}

/**
 * Muestra u oculta el panel de filtros según la cantidad de personajes
 * disponibles. Por debajo del umbral (UMBRAL_MOSTRAR_FILTRO), no tiene
 * sentido filtrar: se ocultan los filtros, se resetean a "Todos" y se
 * muestra el catálogo completo en el <select>.
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

/**
 * Resetea ambos filtros en cascada a "Todos" y repuebla el select de alias
 * y el contador de resultados en consecuencia.
 */
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
// Pantalla emergente con las reglas del juego, accesible desde el botón
// "Reglas" tanto en la selección de personaje como durante el combate.
// =============================================================================

const modalReglas       = document.getElementById('modal-reglas');
const btnCerrarReglas   = document.getElementById('btn-cerrar-reglas');

document.getElementById('show-rules').addEventListener('click', () =>
    modalReglas.classList.add('activo'));

document.getElementById('show-rules-combat').addEventListener('click', () =>
    modalReglas.classList.add('activo'));

btnCerrarReglas.addEventListener('click', () =>
    modalReglas.classList.remove('activo'));

// Cerrar el modal también al hacer clic fuera del recuadro de contenido
// (es decir, sobre el fondo oscuro), no solo con el botón "Cerrar".
modalReglas.addEventListener('click', e => {
    if (e.target === modalReglas) modalReglas.classList.remove('activo');
});


// =============================================================================
// SELECCIÓN DE PERSONAJE Y PREPARACIÓN DE LA ARENA
// =============================================================================

/**
 * Se ejecuta al hacer clic en "Confirmar Selección".
 * Busca en el catálogo los datos del personaje elegido en el <select>,
 * crea una instancia nueva de Avatar para el jugador (con sus 3 vidas de
 * arranque) y muestra el mapa. El enemigo ya no se sortea: se elige al
 * chocar con uno de los enemigos del mapa (ver revisarColision).
 */
function seleccionarPersonajeJugador() {
    const seleccionID = document.getElementById('select-personaje').value;

    if (!seleccionID) {
        alert("¡Debes elegir un maestro antes de ir a la arena!");
        return;
    }

    // Buscamos los datos base del personaje elegido dentro del catálogo
    const baseJ = personajesDisponibles.find(p => p.id === seleccionID);
    if (!baseJ) {
        alert("¡Debes elegir un maestro antes de ir a la arena!");
        return;
    }

    // Creamos instancias FRESCAS (vidas reseteadas a 3) a partir de esos datos.
    // No reutilizamos el objeto del catálogo directamente para no arrastrar
    // vidas de una partida anterior.
    jugador = new Avatar(baseJ.id, baseJ.nombre, baseJ.imagen, baseJ.elemento, baseJ.alias);

    seccionSeleccionar.classList.add('oculto');
    const seccionCrear = document.getElementById('seccion-crear');
    if (seccionCrear) seccionCrear.classList.add('oculto');
    seccionReiniciar.classList.remove('oculto');

    // Mostramos el mapa para buscar al enemigo
    sectionVerMapa.style.display = 'flex';

    iniciarMapa();
}

/**
 * Se ejecuta al chocar con un enemigo en el mapa: ese enemigo pasa a ser el
 * rival del combate. Le devolvemos sus 3 vidas por si ya peleó antes.
 *
 * @param {Avatar} enemigoMapa - Enemigo del mapa con el que se chocó
 */
function seleccionarPersonajeEnemigo(enemigoMapa) {
    enemigo = enemigoMapa;
    enemigo.vidas = 3;

    prepararPantallaArena();
}

/**
 * Dibuja el "sprite" de un personaje dentro de un contenedor de la arena:
 * si tiene ruta de imagen, muestra la foto; si no (personaje custom sin
 * foto), muestra el emoji correspondiente a su elemento.
 *
 * @param {HTMLElement} contenedor - Nodo que contiene el <span class="sprite">
 * @param {Avatar} personaje       - Instancia de Avatar a mostrar
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

/**
 * Muestra la arena de combate (después de chocar con un enemigo en el mapa),
 * dejando todo listo visualmente: sprites, nombres, vidas al 100% y las
 * etiquetas de los 3 botones de ataque acordes al elemento del jugador.
 */
function prepararPantallaArena() {
    seccionCombate.classList.remove('oculto');
    seccionMensajes.classList.remove('oculto');

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

    // Actualizar etiquetas de los 3 botones de ataque según el elemento del
    // jugador: cada elemento tiene nombres/emojis distintos para el mismo
    // tipo de ataque (por ejemplo, "puño" en fuego se llama "Puño 👊" pero
    // en agua se llama "Ola 🌊").
    jugador.ataques.forEach((ataque, i) => {
        const ids = ['btn-puño', 'btn-patada', 'btn-barrida'];
        const btn = document.getElementById(ids[i]);
        if (btn) {
            btn.textContent = ataque.label;
            // Reemplazar clases de color previas por la del elemento actual
            btn.className = `btn-ataque ${ataque.clase}`;
        }
    });
}

/**
 * Se ejecuta al hacer clic en "Volver a Jugar 🔄".
 * Sale del combate sin recargar la página y sin tocar el catálogo de
 * personajes (los que se crearon quedan disponibles). Preselecciona el
 * mismo personaje que tenía el jugador, para poder revanchar rápido.
 */
function volverAJugar() {
    const idJugadorActual = jugador ? jugador.id : "";

    // Limpiamos las instancias de la partida anterior
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
    sectionVerMapa.style.display = 'none';
    clearInterval(intervalo); // dejamos de repintar el mapa
    lienzo.clearRect(0, 0, mapa.width, mapa.height);

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
 * Se ejecuta al hacer clic en "Terminar el juego".
 * Restaura el catálogo a los 4 personajes originales (acción destructiva:
 * borra todos los personajes creados a mano, aleatorios o masivos), previa
 * confirmación del usuario.
 * Mutamos el array existente IN-PLACE (vaciándolo y volviendo a llenarlo)
 * en vez de crear un array nuevo, para conservar la misma referencia global
 * que ya usan el resto de las funciones del archivo.
 */
function reiniciarTodo() {
    const confirmar = confirm(
        "¿Reiniciar el catálogo? Se perderán todos los personajes generados."
    );
    if (!confirmar) return;

    personajesDisponibles.length = 0; // vacía el array sin perder la referencia
    personajesDisponibles.push(...Avatar.generarDesdedatos(CATALOGO_PERSONAJES));

    resetearFiltrosCascada();
    renderizarPersonajes();
    aplicarFiltroPersonajes();
    actualizarVisibilidadFiltro();
}


// =============================================================================
// LÓGICA DE COMBATE
// Sistema tipo "piedra, papel o tijeras" resuelto con Avatar.VENTAJAS.
// =============================================================================

/**
 * Se ejecuta cada vez que el jugador hace clic en uno de los 3 botones de
 * ataque. Sortea el ataque del enemigo, compara ambos ataques usando la
 * tabla estática Avatar.VENTAJAS, aplica el daño correspondiente llamando
 * al método de instancia recibirDanio() del objeto que pierde, y actualiza
 * la interfaz.
 *
 * @param {string} ataqueJugador - "puño" | "patada" | "barrida"
 */
function procesarTurno(ataqueJugador) {
    // Si alguno de los dos ya perdió, no se procesan más turnos
    if (!jugador.estaVivo() || !enemigo.estaVivo()) return;

    // El enemigo usa el método de instancia de su propio objeto para elegir
    // su ataque — cada Avatar decide su jugada usando sus propios datos.
    const ataqueEnemigo = enemigo.elegirAtaqueAleatorio();

    // Animaciones cortas de "golpe" en ambos sprites
    visualJugador.classList.add('ataque-jugador');
    visualEnemigo.classList.add('ataque-enemigo');
    setTimeout(() => {
        visualJugador.classList.remove('ataque-jugador');
        visualEnemigo.classList.remove('ataque-enemigo');
    }, 200);

    // Buscamos las etiquetas visuales (con emoji) de cada ataque, según el
    // elemento de cada personaje, para mostrarlas en el mensaje de resultado.
    const labelJ = jugador.ataques.find(a => a.id === ataqueJugador)?.label ?? ataqueJugador.toUpperCase();
    const labelE = enemigo.ataques.find(a => a.id === ataqueEnemigo)?.label ?? ataqueEnemigo.toUpperCase();

    // Resolución del turno usando la tabla estática de ventajas de la clase Avatar
    if (ataqueJugador === ataqueEnemigo) {
        // Empate: mismo ataque de los dos lados, nadie pierde vida
        textoResultado.innerHTML =
            `Lanzaste <strong>${labelJ}</strong>. El rival respondió con <strong>${labelE}</strong>.<br>
             💥 ¡Choque de guardias! Las fuerzas están niveladas.`;

    } else if (Avatar.VENTAJAS[ataqueJugador] === ataqueEnemigo) {
        // El ataque del jugador le gana al del enemigo
        enemigo.recibirDanio();   // método de instancia del objeto enemigo
        visualEnemigo.classList.add('recibir-daño');
        setTimeout(() => visualEnemigo.classList.remove('recibir-daño'), 400);
        textoResultado.innerHTML =
            `¡Tu <strong>${labelJ}</strong> conectó contra la <strong>${labelE}</strong> del rival!<br>
             🏆 ¡Impacto limpio! El rival pierde una vida.`;

    } else {
        // El ataque del enemigo le gana al del jugador
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

/**
 * Sincroniza los números y las barras de vida en pantalla con el estado
 * real de los objetos jugador/enemigo (this.vidas de cada Avatar).
 * Pinta la barra de rojo cuando a ese personaje le queda 1 sola vida.
 */
function actualizarInterfazVidas() {
    vidasJugador.textContent = jugador.vidas;
    vidasEnemigo.textContent = enemigo.vidas;

    barraJ.style.width = `${(jugador.vidas / 3) * 100}%`;
    barraE.style.width = `${(enemigo.vidas / 3) * 100}%`;

    if (jugador.vidas === 1) barraJ.style.backgroundColor = "#ef4444";
    if (enemigo.vidas === 1) barraE.style.backgroundColor = "#ef4444";
}

/**
 * Revisa si la partida terminó (alguno de los dos, o ambos, se quedó sin
 * vidas usando estaVivo()) y muestra el mensaje final correspondiente.
 */
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

// =============================================================================
// MAPA DE ENCUENTRO: DIBUJO Y MOVIMIENTO DEL PERSONAJE
// =============================================================================

/**
 * Prepara el mapa: define el tamaño del canvas, obtiene el objeto del
 * personaje elegido, arranca el repintado cada 50 ms y escucha el teclado.
 */
function iniciarMapa() {
    mapa.width = 480;  // ancho del canvas
    mapa.height = 360; // alto del canvas

    personajeJugadorObjeto = obtenerObjetoPersonaje();
    // Lo ubicamos en la posición inicial y quieto (por si ya se usó antes)
    personajeJugadorObjeto.x = 15;
    personajeJugadorObjeto.y = 15;
    personajeJugadorObjeto.velocidadX = 0;
    personajeJugadorObjeto.velocidadY = 0;

    clearInterval(intervalo);
    intervalo = setInterval(pintarCanvas, 50);

    window.addEventListener('keydown', sePresionoUnaTecla); // escucha cuando se presiona una tecla
    window.addEventListener('keyup', detenerMovimiento);    // al soltarla, se detiene el movimiento
}

/**
 * Recorre los personajes disponibles y retorna el objeto completo del
 * personaje que coincide con el elegido por el jugador.
 * @returns {Avatar} objeto del personaje seleccionado
 */
function obtenerObjetoPersonaje() {
    for (let i = 0; i < personajesDisponibles.length; i++) {
        if (jugador.id === personajesDisponibles[i].id) {
            return personajesDisponibles[i];
        }
    }
}

/**
 * Se ejecuta constantemente (setInterval). Actualiza la posición del
 * personaje según su velocidad, limpia el canvas y vuelve a dibujar todo:
 * primero el fondo del mapa, encima el personaje y los enemigos. Si el
 * personaje se está moviendo, revisa si chocó con algún enemigo.
 */
function pintarCanvas() {
    personajeJugadorObjeto.x = personajeJugadorObjeto.x + personajeJugadorObjeto.velocidadX; // actualizamos según la velocidad
    personajeJugadorObjeto.y = personajeJugadorObjeto.y + personajeJugadorObjeto.velocidadY;

    lienzo.clearRect(0, 0, mapa.width, mapa.height); // limpiamos el canvas

    // Fondo: arranca en la esquina superior izquierda (0, 0) y ocupa todo el canvas
    if (mapaBackground.complete && mapaBackground.naturalWidth > 0) {
        lienzo.drawImage(
            mapaBackground,
            0,
            0,
            mapa.width,
            mapa.height
        );
    }

    personajeJugadorObjeto.pintarAvatares();

    zukoEnemigo.pintarAvatares();
    kataraEnemigo.pintarAvatares();
    aangEnemigo.pintarAvatares();
    tophEnemigo.pintarAvatares();

    if (personajeJugadorObjeto.velocidadX !== 0 || personajeJugadorObjeto.velocidadY !== 0) {
        revisarColision(zukoEnemigo);
        revisarColision(aangEnemigo);
        revisarColision(kataraEnemigo);
        revisarColision(tophEnemigo);
    }
}

/**
 * Compara los bordes del personaje con los del enemigo. Si NO se tocan
 * (uno está totalmente arriba, abajo, a la derecha o a la izquierda del
 * otro), no pasa nada. Si se tocan, hay colisión: se detiene el mapa y se
 * pasa al combate contra ese enemigo.
 *
 * @param {Avatar} enemigo - Enemigo del mapa a revisar
 */
function revisarColision(enemigo) {
    // Si ya hubo un choque en este mismo repintado (el personaje quedó
    // quieto), no revisamos al resto para no elegir dos enemigos a la vez.
    if (personajeJugadorObjeto.velocidadX === 0 && personajeJugadorObjeto.velocidadY === 0) return;

    const arribaEnemigo = enemigo.y; // acá se comienza a pintar al enemigo
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const derechaEnemigo = enemigo.x + enemigo.ancho;
    const izquierdaEnemigo = enemigo.x;

    const arribaPersonaje =
        personajeJugadorObjeto.y;
    const abajoPersonaje =
        personajeJugadorObjeto.y + personajeJugadorObjeto.alto;
    const derechaPersonaje =
        personajeJugadorObjeto.x + personajeJugadorObjeto.ancho;
    const izquierdaPersonaje =
        personajeJugadorObjeto.x;

    if (
        abajoPersonaje < arribaEnemigo ||
        arribaPersonaje > abajoEnemigo ||
        derechaPersonaje < izquierdaEnemigo ||
        izquierdaPersonaje > derechaEnemigo
    ) {
        return;
    }

    detenerMovimiento();
    clearInterval(intervalo); // dejamos de repintar el mapa

    // Ocultamos el mapa y pasamos al combate contra el enemigo del choque
    sectionVerMapa.style.display = 'none';
    seleccionarPersonajeEnemigo(enemigo);
    // alert("Hay colisión con " + enemigo.nombre);
}

// Las funciones de movimiento solo cambian la velocidad; el que mueve y
// dibuja al personaje es pintarCanvas(), que se ejecuta cada 50 ms.
function moverDerecha() {
    personajeJugadorObjeto.velocidadX = 5;
}

function moverIzquierda() {
    personajeJugadorObjeto.velocidadX = -5;
}

function moverAbajo() {
    personajeJugadorObjeto.velocidadY = 5;
}

function moverArriba() {
    personajeJugadorObjeto.velocidadY = -5;
}

/**
 * Se ejecuta al soltar el botón o la tecla: pasa la velocidad a cero y el
 * personaje se queda quieto.
 */
function detenerMovimiento() {
    personajeJugadorObjeto.velocidadX = 0;
    personajeJugadorObjeto.velocidadY = 0;
}

/**
 * Recibe el evento del teclado (event.key dice qué tecla se presionó) y,
 * según la flecha, llama a la función de movimiento correspondiente.
 * @param {KeyboardEvent} event
 */
function sePresionoUnaTecla(event) {
    switch (event.key) {
        case 'ArrowUp':
            moverArriba();
            break;
        case 'ArrowDown':
            moverAbajo();
            break;
        case 'ArrowLeft':
            moverIzquierda();
            break;
        case 'ArrowRight':
            moverDerecha();
            break;
        default:
            break;
    }
}

// =============================================================================
// INICIALIZACIÓN
// Se ejecuta una sola vez, al cargar el script, para dejar la pantalla de
// selección lista (dropdown poblado, filtros reseteados, panel de filtros
// oculto o visible según la cantidad de personajes disponibles).
// =============================================================================
sectionVerMapa.style.display = 'none'; // el mapa arranca oculto
resetearFiltrosCascada();
renderizarPersonajes();
aplicarFiltroPersonajes();
actualizarVisibilidadFiltro();