import {defineAction,ActionError} from 'astro:actions';
import {z} from 'astro:schema';
import { prisma } from '../../lib/prisma';

export const consultaTramites = defineAction({

    input: z.coerce.number().int(),

    handler: async (input) => {

        // Lógica aquí
    
        const tramites = await prisma.catalogo_tramites.findMany({
            where:{
                id_tramite_padre: null,

                areas_atencion:{
                    id_direccion_general: input
                }
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