import {defineAction, ActionError} from 'astro:actions';
import {success, z} from 'astro:schema';
import {prisma} from '../../lib/prisma'
import bcrypt from 'bcryptjs';


export const loguearUsuario = defineAction({

    accept: 'form',

    input: z.object({
        usuario: z.string({message: 'El usuario es obligatorio.'}).min(3,'El usuario no puede estar vacío.'),

        clave: z.string({message: 'La contraseña es obligatoria'}).min(4,'La contraseña no puede estar vacía'),
    }),

    handler: async ({usuario, clave}, context) => {

        const usuario_sistema = await prisma.usuarios_sistema.findUnique({
            where: {usuario},
            include:{perfiles_usuarios:true}
        });

        if (!usuario_sistema) {
            throw new ActionError({
                code: 'UNAUTHORIZED',
                message: 'Usuario incorrecto'
            })
        };
        
        const validacionClave = await bcrypt.compare(clave, usuario_sistema.clave);

        if (!validacionClave) {
            throw new ActionError({
                code:'UNAUTHORIZED',
                message:'Contraseña incorrecta'
            })
        }

        context.cookies.set(
            'session_user',
            JSON.stringify({
                id: usuario_sistema.id_usuario,
                nombre: usuario_sistema.nombre_completo,
                perfil: usuario_sistema.perfiles_usuarios.tipo_perfil
            }),
            {
                path: '/',
                httpOnly: true,
                secure: import.meta.env.PROD,
                sameSite:'lax',
                // maxAge: 60 * 60 * 8
            }
            
        )

        return{
            success: true,
            message: 'Inicio de sesión exitoso.'
        }

    },

});