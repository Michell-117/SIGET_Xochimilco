import {actions} from 'astro:actions';

const formulario = document.getElementById('formularioNuevoDomicilioPeticionario') as HTMLFormElement;
const mensajeError = document.getElementById('error-envio') as HTMLDivElement;
const limpiarFormulario = document.getElementById('limpiar_formulario') as HTMLButtonElement;
const modalExito = document.getElementById('modal-exito-nuevo-domicilio') as HTMLDivElement;
const idPeticionario = document.getElementById('idPeticionarioNuevoDomicilio') as HTMLParagraphElement
const domicilioNuevo = document.getElementById('domicilioNuevo') as HTMLParagraphElement

formulario.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const formData = new FormData(formulario);

    const {data,error} = await actions.registrarNuevoDomicilioPeticionario(formData)

    if(data){
        modalExito.classList.remove('hidden');
        idPeticionario.textContent = data.data.id_peticionario;
        domicilioNuevo.textContent = `${data.data.calle} ${data.data.numero_exterior}`
    }
    if (error) {
        mensajeError.classList.remove('hidden')
        console.log(error)
    }

    formulario.reset()
})

limpiarFormulario.addEventListener('click', (e)=>{
    e.preventDefault()
    mensajeError.classList.add('hidden');
});