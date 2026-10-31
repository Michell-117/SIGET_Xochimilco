import {defineMiddleware} from 'astro:middleware'

const PERMISOS_RUTAS: Record<string, string[]> = {
    '/usuarios': ['administrador'],
    '/ingresos': ['administrador', 'lider', 'ingresos'],
    '/respuestas': ['administrador', 'lider', 'respuestas'],
    '/estadisticas': ['administrador', 'lider', 'ingresos', 'respuestas']
}

export const onRequest = defineMiddleware( (context, next)=>{

    const {url,cookies, redirect, locals} = context;
    const pathname = url.pathname;

    const sessionCokie = cookies.get('session_user')
    let usuario = null

    if (sessionCokie?.value) {
        
        try {
            usuario = JSON.parse(sessionCokie.value)
        } catch (error) {
            cookies.delete( 'session_user', { path:'/' } )
        }   
    }

    locals.usuario = usuario;

    const usuarioAutenticado = !!usuario;
    const paginaLogin = pathname === "/login";
    const isPublicAsset = pathname.startsWith('/_astro') || pathname.startsWith('/favicon') || pathname.startsWith('/_actions');

    if (isPublicAsset) {
        return next();
    }

    if (!usuarioAutenticado && !paginaLogin) {
        return redirect('/login');
    }

    if (usuarioAutenticado && paginaLogin) {
        return redirect('/');
    }

    // validacion de rutas permitidas

    if (usuarioAutenticado) {

        const perfilUsuario = usuario?.perfil.toLowerCase() ?? "";

        // Buscamos si la ruta actual es coincide o empieza con una ruta protegida
        const rutaProtegida = Object.keys(PERMISOS_RUTAS).find( (ruta)=>{
            return pathname.startsWith(ruta)
        })

        if (rutaProtegida) {
            const rolesPermitidos = PERMISOS_RUTAS[rutaProtegida]

            if (!rolesPermitidos.includes(perfilUsuario)) {
                return redirect('/');
            }
        }
    }

    return next();
} );