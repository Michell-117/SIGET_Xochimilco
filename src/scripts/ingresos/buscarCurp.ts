import {actions} from 'astro:actions';

const formulario = document.getElementById("formulario-buscar-curp") as HTMLFormElement;
const divRegistrado = document.getElementById("status-registrado") as HTMLDivElement;
const divNoRegistrado = document.getElementById("status-no-registrado") as HTMLDivElement;
const divPlaceholder = document.getElementById("status-placeholder") as HTMLDivElement;

formulario?.addEventListener('submit',async (evento)=>{
    
    evento.preventDefault();
    divPlaceholder.classList.remove('hidden')
    divNoRegistrado.classList.add('hidden')
    divRegistrado.classList.add('hidden')
   
    if (divPlaceholder) {
        divPlaceholder.innerText= 'Procesando...'
    }

    const formularioCurp = new FormData(formulario)
    const {data,error} = await actions.buscarCurp(formularioCurp)

    if (error) {
        divPlaceholder.classList.add('hidden')
        divNoRegistrado.classList.remove('hidden')
        console.log(error)
        return;
    }

    if (data?.curp) {
        divPlaceholder.classList.add('hidden')
        divRegistrado.classList.remove('hidden')
        console.log(data.curp)
    }

    if(!data.curp){
        divPlaceholder.classList.add('hidden')
        divNoRegistrado.classList.remove('hidden')
    }
    
    formulario.reset();
})
