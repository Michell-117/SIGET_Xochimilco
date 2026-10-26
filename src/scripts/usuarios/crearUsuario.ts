import { actions } from 'astro:actions';

const formulario = document.getElementById("formulario_crear_usuario") as HTMLFormElement;
const divMensaje = document.getElementById("mensaje-estado") as HTMLDivElement;

formulario?.addEventListener("submit", async (evento)=>{
    evento.preventDefault();

    if (divMensaje){
        divMensaje.textContent = "Procesando...";
        divMensaje.style.color = "#333";
    }

    const dataFormulario = new FormData(formulario);

    const { data,error } = await actions.crearUsuario(dataFormulario)

    if(error){
        if (divMensaje) {
            divMensaje.textContent = error.message;
            divMensaje.style.backgroundColor = 'red';
            divMensaje.style.color = 'white'
        }
        return;
    }

    if (divMensaje) {
        divMensaje.textContent = data.message;
        divMensaje.style.backgroundColor = 'green';
        divMensaje.style.color = 'white'
    }

    formulario.reset();
})
