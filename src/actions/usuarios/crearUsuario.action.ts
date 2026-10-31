import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';

export const crearUsuario = defineAction({
    accept: 'form',

    input: z.object({

        usuario: z
        .string({message: 'El usuario es requerido.'})
        .min(3, 'Mínimo 3 caracteres'),

        nombre_completo: z
        .string({message: 'El nombre completo es requerido.'})
        .min(5, 'Mínimo 5 caracteres'),

        clave: z
        .string({message: 'La contraseña es requerido.'})
        .min(3, 'Mínimo 3 caracteres'),

        id_perfil: z.number(),

    }),

    handler: async({usuario,nombre_completo,clave,id_perfil})=>{

        //Verificar si el usuario o el nombre completo existe
        const existeUsuario = await prisma.usuarios_sistema.findFirst({
            where:{
                OR:[
                    {usuario},
                    {nombre_completo}
                ]
            }
        })

        // Si existe un usuario ejecutamos
        if (existeUsuario) {

            if (existeUsuario.usuario === usuario) {
                throw new ActionError({
                    code: 'BAD_REQUEST',
                    message: 'El nombre de usuario ya existe.'
                })
            }

            if (existeUsuario.nombre_completo === nombre_completo) {
                throw new ActionError({
                    code: 'BAD_REQUEST',
                    message: 'La persona ya cuenta con un usuario registrado.'
                })
            }
        }

        // Si no existe un usuario
        // primero hasheamos contraseña para posteriormente guardarla en la base
        const claveHasheada = await bcrypt.hash(clave,10);

        // Creamos el usuario en la base de datos
        const nuevo_usuario = await prisma.usuarios_sistema.create({
            data:{
                usuario,
                nombre_completo,
                clave: claveHasheada,
                id_perfil,
            }
        });

        // Retornamos un objeto con el userId y un Message

        return {
            message: `Usuario '${nuevo_usuario.usuario}' registrado exitosamente.`
        };
    }
});

