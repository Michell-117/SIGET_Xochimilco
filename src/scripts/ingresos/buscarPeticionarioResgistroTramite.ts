import {actions} from "astro:actions";

const formularioBusquedaPeticionario = document.getElementById('formulario_busqueda_peticionario_registro_tramite') as HTMLFormElement;
const mensajePositivo = document.getElementById('peticionario_registrado') as HTMLDivElement;
const mensajeAlerta = document.getElementById('peticionario_no_registrado') as HTMLDivElement;
const mensajeNeutro = document.getElementById('status-placeholder') as HTMLDivElement;
const inputNombrePeticionario = document.getElementById('nombre_peticionario') as HTMLInputElement;
const inputIdPeticionario = document.getElementById('id_peticionario') as HTMLInputElement;
const selectDomicilios = document.getElementById('id_domicilio') as HTMLSelectElement;


formularioBusquedaPeticionario.addEventListener('submit', async (e)=>{

    e.preventDefault();
    // console.log('Hola registro tramite')

    const formulario = new FormData(formularioBusquedaPeticionario)
    const {data,error} = await actions.buscarDomicilioPeticionarioPorCurp(formulario)

    if(error){
        mensajeAlerta.classList.remove('hidden')
        mensajePositivo.classList.add('hidden')
        mensajeNeutro.classList.add('hidden')
        console.log(error)
    }
    if(data){
        mensajePositivo.classList.remove('hidden')
        mensajeAlerta.classList.add('hidden')
        mensajeNeutro.classList.add('hidden')
        inputNombrePeticionario.value = data.nombreCompleto
        inputIdPeticionario.value = data.id_peticionario
        const opcionesDomicilio = data.domicilios
            .map((domicilio) => `<option class="bg-white text-slate-800" value="${domicilio.id_domicilio}">${domicilio.calle} ${domicilio.numero_exterior}, C.P: ${domicilio.asentamiento.codigo_postal}</option>`)
            .join('');
        
        selectDomicilios.innerHTML = `
            <option value="" disabled selected hidden>-- Selecciona el domicilio --</option>
            ${opcionesDomicilio}
        `;
        selectDomicilios.disabled = false

    }
})