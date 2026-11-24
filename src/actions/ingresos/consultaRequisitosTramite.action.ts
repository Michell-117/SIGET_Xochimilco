import {defineAction,ActionError} from 'astro:actions';
import {z} from 'astro:schema';
import { prisma } from '../../lib/prisma';

export const consultaRequisitosTramite = defineAction({

    input: z.coerce.number().int(),

    handler: async (input) => {

        // Lógica aquí
    
        const requisitos = await prisma.requisitos_tramite.findMany({
            where:{
                id_catalogo_tramite: input,
            },
            select:{
                es_obligatorio: true,
                orden:true,
                catalogo_requisitos:{
                    select:{
                        id_requisito: true,
                        nombre_requisito: true,
                        descripcion: true,
                        activo: true,
                    }
                }
            },
            orderBy:{
                orden:'asc'
            }
        })

        if(requisitos.length === 0){
            throw new ActionError({
                code:'NOT_FOUND',
                message:'No se pudieron cargar los requisitos del trámite seleccionado.'
            })
        }

        const requisitosTramite = requisitos.map((requisito)=>({
            id_requisito: requisito.catalogo_requisitos.id_requisito,
            nombre_requisito: requisito.catalogo_requisitos.nombre_requisito,
            descripcion: requisito.catalogo_requisitos.descripcion,
            activo: requisito.catalogo_requisitos.activo,
            es_obligatorio: requisito.es_obligatorio,
            orden: requisito.orden

        }));

        return requisitosTramite;
    },

});