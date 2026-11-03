import {actions} from 'astro:actions';

const selectAsentamiento = document.getElementById('id_asentamiento') as HTMLSelectElement
const inputTipoAsentamiento = document.getElementById('tipo_asentamiento') as HTMLInputElement
const inputAlcaldia = document.getElementById('municipio') as HTMLInputElement
const inputEstado = document.getElementById('estado') as HTMLInputElement

selectAsentamiento.addEventListener('change', async (evento)=>{
    const id_asentamiento = Number( (evento.target as HTMLSelectElement).value)

    inputTipoAsentamiento.value = '-- Procesando --'
    inputAlcaldia.value = '-- Procesando --'
    inputEstado.value = '-- Procesando --'

    if(id_asentamiento){

        const {data,error} = await actions.buscarAsentamiento({id_asentamiento})

        if(error){
            inputTipoAsentamiento.value = error.message
            inputAlcaldia.value = error.message
            inputEstado.value = error.message
        }

        if(data){

            const {tipo_asentamiento,municipio} = data
            
            inputTipoAsentamiento.value = tipo_asentamiento.tipo_asentamiento;
            inputAlcaldia.value = municipio.municipio;
            inputEstado.value = municipio.estado.estado;

        }
    }
})