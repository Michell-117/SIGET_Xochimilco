import {actions} from 'astro:actions';

const inputCodigoPostal = document.getElementById('codigo_postal') as HTMLInputElement
const selectAsentamientos = document.getElementById('id_asentamiento') as HTMLSelectElement

inputCodigoPostal?.addEventListener('input',async (evento)=>{
    const codigo_postal = (evento.target as HTMLInputElement).value

    if (codigo_postal.length===5) {
        
        const {data, error} = await actions.buscarCP({codigo_postal})

        if(error){
            selectAsentamientos.innerHTML = `<option value="" disabled selected hidden>-- ${error.message} --</option>`;
            return;
        }
        if (data && data.length > 0 ) {
            
            const opcionesHTML = data
                .map((a) => `<option class="bg-white text-slate-800" value="${a.id_asentamiento}">${a.asentamiento}</option>`)
                .join('');

            selectAsentamientos.innerHTML = `
                <option value="" disabled selected hidden>-- Selecciona un asentamiento --</option>
                ${opcionesHTML}
            `;
            selectAsentamientos.disabled = false;
            selectAsentamientos.removeAttribute('disabled');
        }
    }else {
        selectAsentamientos.innerHTML = '<option value="" disabled selected hidden>-- Ingresa C.P. --</option>';
        selectAsentamientos.disabled = true;
    }
})