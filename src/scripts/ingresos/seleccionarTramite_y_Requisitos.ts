import {actions} from 'astro:actions';
import { crearTarjetaRequisitoHTML } from './crearTarjetaRequisitoHTML';

const formulario = document.getElementById('formularioNuevoTramitePeticionario') as HTMLFormElement;
const selectDomicilios = document.getElementById('id_domicilio') as HTMLSelectElement;
const inputIdPeticionario = document.getElementById('id_peticionario') as HTMLInputElement;
const selectDireccion = document.getElementById('id_direccion_general') as HTMLSelectElement;
const selectTramite = document.getElementById('id_catalogo_tramite') as HTMLSelectElement;
const selectSubTramite = document.getElementById('id_catalogo_sub_tramite') as HTMLSelectElement;
const inputFolio = document.getElementById('folio') as HTMLInputElement;
const inputDias = document.getElementById('dias_respuesta') as HTMLInputElement;
const contenedorRequisitos = document.getElementById('columna_2') as HTMLDivElement;
const modalExito = document.getElementById('modal-exito-creacion-tramite') as HTMLDivElement;
const paragraph_idTramite = document.getElementById('idTramite') as HTMLParagraphElement;
const paragraph_InfoTramite = document.getElementById('infoTramite') as HTMLParagraphElement;
const mensajeError = document.getElementById('error-envio') as HTMLDivElement;


interface RequisitosTramite {
    id_tramite: number;
    id_requisito: number;
    entregado: boolean;
}

interface TramiteRegistro {
    folio: string;
    id_peticionario: string;
    id_domicilio: number;
    id_catalogo_tramite: number;
    dias_respuesta: number;
    requisitos: RequisitosTramite[];
}

const datosCrearTramite: TramiteRegistro = {
    folio:'Sin Folio',
    id_peticionario: 'Sin Peticionario',
    id_domicilio:0,
    dias_respuesta:0,
    id_catalogo_tramite: 0,
    requisitos:[]
}

formulario.addEventListener('reset',(e)=>{
    e.preventDefault()
    window.location.reload();
})

contenedorRequisitos.addEventListener('click', (e) => {
    // Type Guard: verifica que e.target exista y sea un elemento del DOM
    if (!(e.target instanceof Element)) return;

    const btn = e.target.closest<HTMLButtonElement>('.btn-toggle-desc');
    if (!btn) return;

    const tarjeta = btn.closest('.rounded-xl');
    const cajaDesc = tarjeta?.querySelector('.desc-requisito');
    const icono = btn.querySelector('.icono-plus');

    if (!cajaDesc) return;

    const estaOculto = cajaDesc.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!estaOculto));

    icono?.classList.toggle('rotate-45', !estaOculto);
    btn.classList.toggle('bg-orange-600', !estaOculto);
    btn.classList.toggle('text-white', !estaOculto);
    btn.classList.toggle('bg-orange-50', estaOculto);
    btn.classList.toggle('text-orange-600', estaOculto);
});

const {data,error} = await actions.consultaDireccionesGenerales();

if(error){
    console.log(error)
}

if(data){
    const opcionesDireccionesHTML = data
        .map((direccion) => `<option class="bg-white text-slate-800" value="${direccion.id_direccion_general}">${direccion.nombre_direccion}</option>`)
        .join('');
    
    selectDireccion.innerHTML = `
        <option value="" disabled selected hidden>-- Selecciona una Dirección General --</option>
        ${opcionesDireccionesHTML}
    `;
}

// ------------------------------------------------------------------------------------------------------------------
// Domicilio del Peticionario y asignaccion de primeros valores al objeto -- datosCrearTramite --
// ------------------------------------------------------------------------------------------------------------------
selectDomicilios.addEventListener('change', ()=>{

    datosCrearTramite.id_peticionario = inputIdPeticionario.value
    datosCrearTramite.id_domicilio = parseInt(selectDomicilios.value,10)
    selectDomicilios.disabled = true
    // console.log(datosCrearTramite)
})

// ------------------------------------------------------------------------------------------------------------------
// Direccion
// ------------------------------------------------------------------------------------------------------------------
selectDireccion.addEventListener('change', async ()=>{

    const {data,error} = await actions.consultaTramites(selectDireccion.value)

    if (error) {
        selectTramite.innerHTML = `<option value="" disabled selected hidden>-- ${error.message} --</option>`
    }

    if (data) {
        const opcionesTramite = data
            .map((tramite)=> `<option class="bg-white text-slate-800" value="${tramite.id_catalogo_tramite}">${tramite.clave_tramite} - ${tramite.nombre_tramite} - ${tramite.dias_habiles_respuesta} días_hábiles</option>`)
            .join('')
        
        selectTramite.innerHTML = `
            <option value="" disabled selected hidden>-- Seleccionar trámite --</option>
            ${opcionesTramite}
        `
        selectTramite.disabled = false;
        selectDireccion.disabled = true;

    }
})

// ------------------------------------------------------------------------------------------------------------------
// Tramite
// ------------------------------------------------------------------------------------------------------------------
selectTramite.addEventListener('change', async ()=>{
    // console.log(`id_tramite: ${selectTramite.value}`);
    datosCrearTramite.id_catalogo_tramite = parseInt(selectTramite.value,10)
    selectTramite.disabled = true
    console.log(datosCrearTramite)

    const {data,error} = await actions.consultaSubTramites(selectTramite.value)

    if (error) {
        // console.log(error)
        selectSubTramite.innerHTML = `
            <option value="" disabled selected hidden>-- ${error.message} --</option>
        `;
    }
    
    if (data) {
        const opcionesSubTramite = data
            .map((st)=> `<option class="bg-white text-slate-800" value="${st.id_catalogo_tramite}">${st.clave_tramite} - ${st.nombre_tramite} ${st.dias_habiles_respuesta ? `- ${st.dias_habiles_respuesta} días hábiles`: ''} </option>`)
            .join('');
        
        selectSubTramite.innerHTML = `
            <option value="" disabled selected hidden>-- Seleccionar trámite específico--</option>
            ${opcionesSubTramite}
        `;

        selectSubTramite.disabled = false;
    }

    const requisitosTramite = await actions.consultaRequisitosTramite(selectTramite.value)

    if (requisitosTramite.error) {
        console.log(requisitosTramite.error)
    }

    if (requisitosTramite.data) {
        const requisitosHTML = requisitosTramite.data
            .filter((r)=> r.activo)
            .map((requisito)=>
                crearTarjetaRequisitoHTML({
                    id_tramite: selectTramite.value,
                    id_requisito: requisito.id_requisito,
                    nombre_requisito: requisito.nombre_requisito,
                    descripcion: requisito.descripcion,
                })
            )
            .join('');
        
        contenedorRequisitos.insertAdjacentHTML('beforeend',`
        
            <fieldset class="col-span-full space-y-2.5 border-0 p-0">

                <legend class="mb-2 flex w-full items-center gap-2 text-xs font-semibold tracking-wide text-orange-500 uppercase">

                    <span>Requisitos generales del trámite: ${selectTramite.options[selectTramite.selectedIndex]?.text.trim() ?? ''}</span>
                    <span class="h-px flex-1 bg-orange-600"></span>

                </legend>

                ${requisitosHTML}

            </fieldset>

        `)
        
    }
})

// ------------------------------------------------------------------------------------------------------------------
// Subtramite
// ------------------------------------------------------------------------------------------------------------------
selectSubTramite.addEventListener('change', async ()=>{
    

    const requisitosTramite = await actions.consultaRequisitosTramite(selectSubTramite.value)

    if (requisitosTramite.error) {
        console.log(requisitosTramite.error)
    }

    if (requisitosTramite.data) {
        const requisitosHTML = requisitosTramite.data
            .filter((r)=> r.activo)
            .map((requisito)=>
                crearTarjetaRequisitoHTML({
                    id_tramite: selectSubTramite.value,
                    id_requisito: requisito.id_requisito,
                    nombre_requisito: requisito.nombre_requisito,
                    descripcion: requisito.descripcion,
                })
            )
            .join('');
        
        contenedorRequisitos.insertAdjacentHTML('beforeend',`
        
            <fieldset class="col-span-full space-y-2.5 border-0 p-0">

                <span class="h-px flex-1 bg-orange-600"></span>
                <legend class="mb-2 flex w-full items-center gap-2 text-xs font-semibold tracking-wide text-orange-500 uppercase">

                    <span>Requisitos específicos del trámite: ${selectSubTramite.options[selectSubTramite.selectedIndex]?.text.trim() ?? ''}</span>

                </legend>

                ${requisitosHTML}

            </fieldset>

        `);
    }

    selectSubTramite.disabled = true;
})

// ------------------------------------------------------------------------------------------------------------------
// Folio
// ------------------------------------------------------------------------------------------------------------------
inputFolio.addEventListener('change',async ()=>{
    datosCrearTramite.folio = inputFolio.value.toUpperCase();
    inputFolio.disabled = true;
    console.log(datosCrearTramite);
})

// ------------------------------------------------------------------------------------------------------------------
// Dias Habiles
// ------------------------------------------------------------------------------------------------------------------
inputDias.addEventListener('change',()=>{
    datosCrearTramite.dias_respuesta = parseInt(inputDias.value,10);
    inputDias.disabled = true;
})
// ------------------------------------------------------------------------------------------------------------------
// Formulario
// ------------------------------------------------------------------------------------------------------------------

formulario.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const dataFormulario = new FormData(formulario)

    for (const [clave, valor] of dataFormulario.entries() ) {
        
        const [id_requisito, id_tramite] = clave.split('_');

        datosCrearTramite.requisitos.push({
            id_requisito: Number(id_requisito),
            id_tramite: Number(id_tramite),
            entregado: valor === 'true',
        })
    }

    const {data,error} =await actions.registrarTramite(datosCrearTramite)
    
    if(error){
        mensajeError.classList.remove('hidden')
        console.log(error)
    }
    if(data?.ok){
        console.log(data.tramite)
        modalExito.classList.remove('hidden');
        paragraph_idTramite.textContent = data.tramite.id_tramite_registro;
        paragraph_InfoTramite.textContent = `Folio: ${data.tramite.folio}, Fecha compromiso: ${data.tramite.fecha_compromiso}, Fecha caducidad: ${data.tramite.fecha_caducidad_conteo}`;
    }
})