import {defineAction,ActionError} from 'astro:actions';
import {z} from 'astro:schema';
import { prisma } from '../../lib/prisma';

export const consultaSubTramites = defineAction({

    input: z.coerce.number().int(),

    handler: async (input) => {

        // Lógica aquí
    
        const tramites = await prisma.catalogo_tramites.findMany({
            where:{
                id_tramite_padre: input,
            }
        })

        if(tramites.length === 0){
            throw new ActionError({
                code:'NOT_FOUND',
                message:'No hay trámites disponibles'
            })
        }

        return tramites;
    },

});