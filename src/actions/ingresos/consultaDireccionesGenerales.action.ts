import {defineAction, ActionError} from 'astro:actions';
import { prisma } from '../../lib/prisma';

export const consultaDireccionesGenerales = defineAction({

    handler: async () => {

        // Lógica aquí
        const direccionesGenerales = await prisma.direcciones_generales.findMany();

        if(direccionesGenerales.length === 0){
            throw new ActionError({
                code:'NOT_FOUND',
                message: 'No hay Direcciones Generales en la BD.'
            })
        }

        return direccionesGenerales;

    },

});