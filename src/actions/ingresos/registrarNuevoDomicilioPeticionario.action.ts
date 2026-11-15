import {defineAction, ActionError} from 'astro:actions';
import {z} from 'astro:schema'
import { prisma } from '../../lib/prisma';

export const registrarNuevoDomicilioPeticionario = defineAction({

    accept: 'form',

    input: z.object({
        id_peticionario: z.string({message: 'El peticionario es obligatorio'}),
        calle: z.string().min(1, 'La calle es obligatoria'),
        numero_exterior: z.string().nullable().optional().transform((val) => val || null),
        numero_interior: z.string().nullable().optional().transform((val) => val || null),
        calle1: z.string().nullable().optional().transform((val) => val || null),
        calle2: z.string().nullable().optional().transform((val) => val || null),
        id_asentamiento: z.coerce.number().int(),
    }),

    handler: async ({id_peticionario,calle,numero_exterior,numero_interior, calle1,calle2,id_asentamiento}) => {

        // Lógica aquí
        try{  
            const nuevoDomicilio = await prisma.domicilio.create({
                data:{
                    calle,
                    numero_exterior,
                    numero_interior,
                    calle1,
                    calle2,
                    id_asentamiento,
                    id_peticionario
                }
            
            })

            return { success: true, data: nuevoDomicilio, message: 'Nuevo domicilio guardado exitosamente.' }

        } catch(error: any){
            throw new ActionError({
                code: 'INTERNAL_SERVER_ERROR',
                // Te mostrará en pantalla la razón exacta (ej. Foreign Key fallida, Registro duplicado, etc.)
                message: error?.message || 'Error en la base de datos.',
            });
        }

    },

});