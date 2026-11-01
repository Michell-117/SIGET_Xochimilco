import {actions} from 'astro:actions'

const botonLogout = document.getElementById('btn-logout');

botonLogout?.addEventListener("click",async ()=>{

    const { data,error } = await actions.logoutUsuario();

    if (error) {
        alert(`Error al cerrar sesiòn: ${error}`);
        return;
    }

    if(data.success){
        window.location.href = "/login";
    }
})