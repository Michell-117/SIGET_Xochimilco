import {actions} from 'astro:actions';

const formularioBusquedaPeticionario = document.getElementById('formulario_busqueda_peticionario_domicilio') as HTMLFormElement;
const mensajePositivo = document.getElementById('peticionario_registrado') as HTMLDivElement;
const mensajeAlerta = document.getElementById('peticionario_no_registrado') as HTMLDivElement;
const mensajeNeutro = document.getElementById('status-placeholder') as HTMLDivElement;

const inputNombre1 = document.getElementById('nombre_1') as HTMLInputElement
const inputNombre2 = document.getElementById('nombre_2') as HTMLInputElement
const inputApellido1 = document.getElementById('apellido_1') as HTMLInputElement
const inputApellido2 = document.getElementById('apellido_2') as HTMLInputElement
const inputCurp = document.getElementById('curpPeticionario') as HTMLInputElement
const inputFechaNacimiento = document.getElementById('fecha_nacimiento') as HTMLInputElement
const inputTipoPersona = document.getElementById('tipo_persona') as HTMLInputElement
const inputIdPeticionario = document.getElementById('id_peticionario') as HTMLInputElement

formularioBusquedaPeticionario.addEventListener('submit', async (e)=>{

    e.preventDefault();
    
    mensajeNeutro.classList.remove('hidden')
    mensajePositivo.classList.add('hidden')
    mensajeAlerta.classList.add('hidden')

    const formulario = new FormData(formularioBusquedaPeticionario)
    const {data,error} = await actions.buscarPeticionarioPorCurp(formulario)

    if (error) {

        mensajeAlerta.classList.remove('hidden')
        mensajePositivo.classList.add('hidden')
        mensajeNeutro.classList.add('hidden')
        console.log(error)

    }

    if (data) {

        mensajePositivo.classList.remove('hidden')
        mensajeAlerta.classList.add('hidden')
        mensajeNeutro.classList.add('hidden')
        inputNombre1.value = data.nombre1
        inputNombre2.value = data.nombre2 === null ? 'Sin nombre':data.nombre2
        inputApellido1.value = data.apellido1
        inputApellido2.value = data.apellido2 === null ? 'Sin apellido':data.apellido2
        inputCurp.value = data.curp ? data.curp : 'CURP no registrada' ;
        inputFechaNacimiento.value = data.fecha_nacimiento ? new Date(data.fecha_nacimiento).toISOString().split('T')[0] : '2026-01-01'  ;
        inputTipoPersona.value = data.tipo_persona
        inputIdPeticionario.value = data.id
    }

    formularioBusquedaPeticionario.reset();
});