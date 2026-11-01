import {defineAction} from 'astro:actions'

export const logoutUsuario = defineAction({

    accept: 'json',

    handler: async (_,context) => {

        context.cookies.delete('session_user', {path:'/'})

        return{
            success: true
        }

    },

});