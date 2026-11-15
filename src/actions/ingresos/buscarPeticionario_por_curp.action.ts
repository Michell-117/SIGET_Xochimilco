import {defineAction,ActionError} from 'astro:actions';
import {z} from 'astro:schema';
import { prisma } from '../../lib/prisma';

export const buscarPeticionarioPorCurp = defineAction({

    accept: 'form',

    input: z.object({
        curp: z.string().min(18),
    }),

    handler: async ({curp}) => {

        // Lógica aquí
        const curpVerificada = curp.trim().toUpperCase()

        const Peticionario = await prisma.peticionario.findFirst({
            where: {curp: curpVerificada},
            include:{tipo_persona:true}
        })

        if(!Peticionario){
            throw new ActionError({
                code:'NOT_FOUND',
                message:'Peticionario no encontrado'
            })
        }

        return {
            id: Peticionario.id_peticionario,
            nombre1: Peticionario.nombre_1,
            nombre2: Peticionario.nombre_2,
            apellido1: Peticionario.apellido_1,
            apellido2: Peticionario.apellido_2,
            curp: Peticionario.curp,
            fecha_nacimiento: Peticionario.fecha_nacimiento,
            tipo_persona: Peticionario.tipo_persona.tipo_persona
        }

    },

});
