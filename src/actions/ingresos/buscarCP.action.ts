import {defineAction, ActionError} from 'astro:actions';
import {z} from 'astro:schema';
import {prisma} from '../../lib/prisma'

export const buscarCP = defineAction({

    input: z.object({
        codigo_postal: z.string({message: 'El C.P. es obligatorio'}).min(5).max(5),
    }),

    handler: async ({codigo_postal}) => {

        const asentamientos = await prisma.asentamiento.findMany({
            where:{codigo_postal},
            select:{
                id_asentamiento:true,
                asentamiento:true,
            },
            orderBy:{
                asentamiento:'asc'
            }
        })

        if (asentamientos.length===0) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'Codigo Postal inválido'
            })
        }

        return asentamientos

    },

});