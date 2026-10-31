// Si el front se abre desde otro puerto (Live Server), la API sigue estando en el 8080
const API_URL = 'http://localhost:8080/api/v1/tareas';

const form = document.getElementById('formTarea');
const lista = document.getElementById('lista');
const vacio = document.getElementById('vacio');
const contador = document.getElementById('contador');
const filtroEstado = document.getElementById('filtroEstado');
const filtroPrioridad = document.getElementById('filtroPrioridad');
const btnLimpiar = document.getElementById('btnLimpiar');
const botonesTema = document.querySelectorAll('[data-tema-btn]');

const indicadores = {
    total: document.getElementById('indTotal'),
    pendientes: document.getElementById('indPendientes'),
    completadas: document.getElementById('indCompletadas'),
    vencidas: document.getElementById('indVencidas')
};

// Todas las tareas que devolvió la API. Los indicadores salen de acá; la lista, de acá ya filtrada
let todasLasTareas = [];

// Campos obligatorios del formulario y el mensaje que se muestra si están vacíos
const camposObligatorios = [
    { input: document.getElementById('titulo'), error: document.getElementById('errorTitulo'), mensaje: 'El título es obligatorio' },
    { input: document.getElementById('fecha'), error: document.getElementById('errorFecha'), mensaje: 'La fecha es obligatoria' },
    { input: document.getElementById('hora'), error: document.getElementById('errorHora'), mensaje: 'La hora es obligatoria' }
];

// ---------- Íconos ----------

const ICONOS = {
    calendario: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    editar: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    eliminar: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    alerta: '<path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17h.01"/>'
};

// El SVG sale de la tabla de arriba (texto fijo, nunca de datos del usuario), por eso es seguro usar innerHTML acá
function icono(nombre, tamanio = 16) {
    const contenedor = document.createElement('span');
    contenedor.className = 'icono';
    contenedor.setAttribute('aria-hidden', 'true');
    contenedor.innerHTML = `<svg viewBox="0 0 24 24" width="${tamanio}" height="${tamanio}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONOS[nombre]}</svg>`;
    return contenedor;
}

// ---------- Comunicación con la API ----------

async function pedir(url, opciones = {}) {
    const respuesta = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...opciones
    });

    if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => null);
        throw new Error(error?.mensajes?.join('\n') || 'Error inesperado del servidor');
    }
    // DELETE devuelve 204 sin cuerpo
    return respuesta.status === 204 ? null : respuesta.json();
}

function mostrarError(mensaje) {
    Swal.fire({ icon: 'error', title: 'Ups', text: mensaje });
}

// ---------- Listado ----------

// Se piden todas las tareas una sola vez y los filtros se aplican acá, así los indicadores
// siempre reflejan el total real aunque haya un filtro activo
async function cargarTareas() {
    try {
        todasLasTareas = await pedir(API_URL);
        mostrarTareas();
    } catch (error) {
        mostrarError('No se pudo conectar con la API. ¿Está corriendo el backend?');
    }
}

// La API ya las entrega ordenadas por fecha y hora; filtrar no altera ese orden
function tareasFiltradas() {
    return todasLasTareas.filter((tarea) =>
        (!filtroEstado.value || String(tarea.finalizada) === filtroEstado.value)
        && (!filtroPrioridad.value || tarea.prioridad === filtroPrioridad.value));
}

function actualizarIndicadores() {
    indicadores.total.textContent = todasLasTareas.length;
    indicadores.pendientes.textContent = todasLasTareas.filter((t) => !t.finalizada).length;
    indicadores.completadas.textContent = todasLasTareas.filter((t) => t.finalizada).length;
    indicadores.vencidas.textContent = todasLasTareas.filter((t) => t.vencida).length;
}

function mostrarTareas() {
    const tareas = tareasFiltradas();
    const pendientes = tareas.filter((t) => !t.finalizada).length;
    const vencidas = tareas.filter((t) => t.vencida).length;

    lista.replaceChildren(...tareas.map(crearElementoTarea));
    actualizarIndicadores();

    // Estados vacíos distintos: sin tareas cargadas, o filtros que no encuentran nada
    const hayFiltros = Boolean(filtroEstado.value || filtroPrioridad.value);
    vacio.textContent = hayFiltros
        ? 'Ninguna tarea coincide con los filtros elegidos.'
        : 'No hay tareas. Creá la primera con el formulario.';
    vacio.hidden = tareas.length > 0;

    contador.textContent = `${pendientes} pendientes · ${vencidas} vencidas`;
}

function crearBadge(clase, texto, nombreIcono) {
    const badge = document.createElement('span');
    badge.className = `badge ${clase}`;
    if (nombreIcono) badge.append(icono(nombreIcono, 12));
    badge.append(texto);
    return badge;
}

function crearDato(nombreIcono, texto) {
    const dato = document.createElement('span');
    dato.className = 'dato';
    dato.append(icono(nombreIcono, 14), texto);
    return dato;
}

function crearBotonAccion(texto, nombreIcono, etiqueta, clases, alHacerClic) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = `btn-icono ${clases}`.trim();
    boton.setAttribute('aria-label', etiqueta);
    boton.append(icono(nombreIcono), texto);
    boton.addEventListener('click', alHacerClic);
    return boton;
}

// Se arma con textContent (no innerHTML) para que un título con HTML no se ejecute
function crearElementoTarea(tarea) {
    const li = document.createElement('li');
    li.className = `tarea ${tarea.prioridad}`;
    if (tarea.finalizada) li.classList.add('finalizada');
    if (tarea.vencida) li.classList.add('vencida');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'check';
    check.checked = tarea.finalizada;
    check.setAttribute('aria-label',
        tarea.finalizada ? `Marcar como pendiente: ${tarea.titulo}` : `Marcar como finalizada: ${tarea.titulo}`);
    check.addEventListener('change', () => cambiarEstado(tarea.id, check.checked));

    const info = document.createElement('div');
    info.className = 'info';

    const titulo = document.createElement('div');
    titulo.className = 'titulo';
    titulo.textContent = tarea.titulo;
    info.append(titulo);

    if (tarea.descripcion) {
        const detalle = document.createElement('div');
        detalle.className = 'detalle';
        detalle.textContent = tarea.descripcion;
        info.append(detalle);
    }

    const prioridad = tarea.prioridad.charAt(0) + tarea.prioridad.slice(1).toLowerCase();
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.append(
        crearDato('calendario', formatearFecha(tarea.fecha)),
        crearDato('reloj', tarea.hora.slice(0, 5)),
        crearBadge(`badge-${tarea.prioridad}`, prioridad)
    );
    if (tarea.finalizada) meta.append(crearBadge('badge-completada', 'Completada', 'check'));
    if (tarea.vencida) meta.append(crearBadge('badge-vencida', 'Vencida', 'alerta'));
    info.append(meta);

    const acciones = document.createElement('div');
    acciones.className = 'acciones';
    acciones.append(
        crearBotonAccion('Editar', 'editar', `Editar tarea: ${tarea.titulo}`, '', () => editarTarea(tarea)),
        crearBotonAccion('Eliminar', 'eliminar', `Eliminar tarea: ${tarea.titulo}`, 'destructivo', () => eliminarTarea(tarea))
    );

    li.append(check, info, acciones);
    return li;
}

// La API manda yyyy-MM-dd; acá se muestra como dd/MM/yyyy
function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
}

// ---------- Validación del formulario ----------

function limpiarError({ input, error }) {
    input.removeAttribute('aria-invalid');
    error.hidden = true;
    error.textContent = '';
}

// Devuelve true si todos los obligatorios están completos; si no, marca los vacíos y enfoca el primero
function validarFormulario() {
    let primeroInvalido = null;

    camposObligatorios.forEach((campo) => {
        if (campo.input.value.trim()) {
            limpiarError(campo);
            return;
        }
        campo.input.setAttribute('aria-invalid', 'true');
        campo.error.textContent = `⚠ ${campo.mensaje}`;
        campo.error.hidden = false;
        primeroInvalido = primeroInvalido || campo.input;
    });

    if (primeroInvalido) primeroInvalido.focus();
    return !primeroInvalido;
}

// El mensaje desaparece apenas la persona empieza a corregir el campo
camposObligatorios.forEach((campo) => {
    campo.input.addEventListener('input', () => limpiarError(campo));
});

// ---------- Acciones ----------

form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (!validarFormulario()) return;

    const tarea = {
        titulo: document.getElementById('titulo').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim() || null,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        prioridad: document.getElementById('prioridad').value
    };

    try {
        await pedir(API_URL, { method: 'POST', body: JSON.stringify(tarea) });
        form.reset();
        await cargarTareas();
    } catch (error) {
        mostrarError(error.message);
    }
});

async function cambiarEstado(id, finalizada) {
    try {
        await pedir(`${API_URL}/${id}/finalizada/${finalizada}`, { method: 'PATCH' });
    } catch (error) {
        mostrarError(error.message);
    }
    await cargarTareas();
}

async function eliminarTarea(tarea) {
    const confirmacion = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar tarea?',
        text: tarea.titulo,
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    if (!confirmacion.isConfirmed) return;

    try {
        await pedir(`${API_URL}/${tarea.id}`, { method: 'DELETE' });
    } catch (error) {
        mostrarError(error.message);
    }
    await cargarTareas();
}

async function editarTarea(tarea) {
    const resultado = await Swal.fire({
        title: 'Editar tarea',
        html: `
            <input id="editTitulo" class="swal2-input" placeholder="Título" aria-label="Título" maxlength="100">
            <input id="editDescripcion" class="swal2-input" placeholder="Descripción" aria-label="Descripción" maxlength="500">
            <input id="editFecha" type="date" class="swal2-input" aria-label="Fecha">
            <input id="editHora" type="time" class="swal2-input" aria-label="Hora">
            <select id="editPrioridad" class="swal2-select" aria-label="Prioridad">
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
            </select>`,
        // Los valores se cargan por propiedad (no dentro del HTML) para evitar inyección
        didOpen: () => {
            document.getElementById('editTitulo').value = tarea.titulo;
            document.getElementById('editDescripcion').value = tarea.descripcion ?? '';
            document.getElementById('editFecha').value = tarea.fecha;
            document.getElementById('editHora').value = tarea.hora.slice(0, 5);
            document.getElementById('editPrioridad').value = tarea.prioridad;
        },
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const datos = {
                titulo: document.getElementById('editTitulo').value.trim(),
                descripcion: document.getElementById('editDescripcion').value.trim() || null,
                fecha: document.getElementById('editFecha').value,
                hora: document.getElementById('editHora').value,
                prioridad: document.getElementById('editPrioridad').value
            };
            if (!datos.titulo || !datos.fecha || !datos.hora) {
                Swal.showValidationMessage('Completá título, fecha y hora');
                return false;
            }
            return datos;
        }
    });
    if (!resultado.isConfirmed) return;

    try {
        await pedir(`${API_URL}/${tarea.id}`, { method: 'PUT', body: JSON.stringify(resultado.value) });
    } catch (error) {
        mostrarError(error.message);
    }
    await cargarTareas();
}

// ---------- Tema claro/oscuro ----------

// El tema inicial ya lo dejó puesto el script del <head>; acá solo se sincronizan los botones
function aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;
    botonesTema.forEach((boton) => {
        boton.setAttribute('aria-pressed', String(boton.dataset.temaBtn === tema));
    });
}

botonesTema.forEach((boton) => {
    boton.addEventListener('click', () => {
        aplicarTema(boton.dataset.temaBtn);
        try {
            localStorage.setItem('tema', boton.dataset.temaBtn);
        } catch (error) {
            // Sin almacenamiento (modo privado): el tema solo dura mientras la página está abierta
        }
    });
});

// ---------- Inicio ----------

filtroEstado.addEventListener('change', mostrarTareas);
filtroPrioridad.addEventListener('change', mostrarTareas);

btnLimpiar.addEventListener('click', () => {
    filtroEstado.value = '';
    filtroPrioridad.value = '';
    mostrarTareas();
});

aplicarTema(document.documentElement.dataset.tema);
cargarTareas();
