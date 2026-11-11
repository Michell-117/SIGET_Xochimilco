import {actions} from 'astro:actions';

const formPeticionario = document.getElementById('form-registro-peticionario') as HTMLFormElement;
const modalExito = document.getElementById('modal-exito-peticionario') as HTMLDivElement;
const mensajeError = document.getElementById('error-envio') as HTMLDivElement;
const peticionarioCurp = document.getElementById('curp-peticionario-registrado') as HTMLParagraphElement
const peticionarioId = document.getElementById('id-peticionario-registrado') as HTMLParagraphElement
const limpiarFormulario = document.getElementById('limpiar_peticionario') as HTMLButtonElement

formPeticionario.addEventListener('submit', async (evento)=>{
    evento.preventDefault();

    const dataFormulario = new FormData(formPeticionario)
    const { data, error } = await actions.registrarPeticionario(dataFormulario);

    if (data?.success) {
        modalExito.classList.remove('hidden');
        peticionarioCurp.textContent = data.data.peticionario.curp;
        peticionarioId.textContent = data.data.peticionario.id_peticionario;
    }
    if (error) {
        mensajeError.classList.remove('hidden');
        console.log(error);
    }
    
})

limpiarFormulario.addEventListener('click', (e)=>{
    e.preventDefault()
    console.log('hola evento')
    mensajeError.classList.add('hidden');
});