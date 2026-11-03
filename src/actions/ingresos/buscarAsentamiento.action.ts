import {defineAction, ActionError} from 'astro:actions';
import {z} from 'astro:schema';
import {prisma} from '../../lib/prisma';

export const buscarAsentamiento = defineAction({

    input: z.object({
        id_asentamiento: z.number(),
    }),

    handler: async ({id_asentamiento}) => {

        const asentamiento = await prisma.asentamiento.findUnique({
            where:{id_asentamiento},
            select:{
                id_asentamiento:true,
                asentamiento:true,
                tipo_asentamiento:{ // nombre tabla
                    select:{
                        id_tipo_asentamiento:true,
                        tipo_asentamiento:true,
                    },
                },
                municipio:{ // nombre tabla
                    select:{
                        id_municipio:true,
                        municipio:true,
                        estado:{
                            select:{
                                id_estado:true,
                                estado:true,
                            },
                        },
                    },
                },
            },
        })        

        if (!asentamiento) {
            throw new ActionError({
                code: 'NOT_FOUND',
                message: 'Asentamiento incorrecto (id).'
            })
        }

        return asentamiento

    },

});