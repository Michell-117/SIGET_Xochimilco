import {defineAction} from 'astro:actions';
import {z} from 'astro:schema';
import {prisma} from '../../lib/prisma'

export const buscarCurp = defineAction({

    accept: 'form',

    input: z.object({
        curp: z.string({message: 'CURP (18 caracteres)'}).min(18),
    }),

    handler: async ({curp}) => {

        const curpLimpia = curp.trim().toUpperCase()
        // Lógica aquí
        const existeCurp = await prisma.peticionario.findFirst({
            where: {curp:curpLimpia}
        })

        if (!existeCurp) {
            return {
                curp: false,
                message: 'Peticionario no registrado'
            }
        }

        return {
            curp:true,
            message:'Peticionario registrado, no registrar nuevamente.'
        }

    },

});