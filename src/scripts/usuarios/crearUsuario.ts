import { actions } from 'astro:actions';

const formulario = document.getElementById("formulario_crear_usuario") as HTMLFormElement;
const divMensaje = document.getElementById("mensaje-estado") as HTMLDivElement;
const spanTexto = document.getElementById("mensaje-texto") as HTMLSpanElement;

// Casteo seguro a tipos SVG pasando por unknown
const svgIcono = document.getElementById("mensaje-icono") as unknown as SVGElement;
const pathIcono = document.getElementById("mensaje-icono-path") as unknown as SVGPathElement;

// Vectores SVG para cada tipo de mensaje
const PATH_WARNING_ERROR = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
const PATH_SUCCESS = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
const PATH_INFO = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

// Limpia estilos previos del contenedor y muestra el div
function prepararMensaje() {
    divMensaje.classList.remove(
        'hidden',
        'bg-red-50', 'border-red-200', 'text-red-700',
        'bg-emerald-50', 'border-emerald-200', 'text-emerald-700',
        'bg-slate-50', 'border-slate-200', 'text-slate-700'
    );
    svgIcono.classList.remove('text-red-500', 'text-emerald-500', 'text-slate-500', 'animate-spin');
    divMensaje.classList.add('flex');
}

formulario?.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (divMensaje && spanTexto) {
        prepararMensaje();
        spanTexto.textContent = "Procesando...";
        divMensaje.classList.add('bg-slate-50', 'border-slate-200', 'text-slate-700');
        svgIcono.classList.add('text-slate-500');
        pathIcono.setAttribute('d', PATH_INFO);
    }

    const dataFormulario = new FormData(formulario);
    const { data, error } = await actions.crearUsuario(dataFormulario);

    if (error) {
        if (divMensaje && spanTexto) {
        prepararMensaje();
        spanTexto.textContent = error.message;
        divMensaje.classList.add('bg-red-50', 'border-red-200', 'text-red-700');
        svgIcono.classList.add('text-red-500');
        pathIcono.setAttribute('d', PATH_WARNING_ERROR);
        }
        return;
    }

    if (divMensaje && spanTexto) {
        prepararMensaje();
        spanTexto.textContent = data.message;
        divMensaje.classList.add('bg-emerald-50', 'border-emerald-200', 'text-emerald-700');
        svgIcono.classList.add('text-emerald-500');
        pathIcono.setAttribute('d', PATH_SUCCESS);
    }

    formulario.reset();
});