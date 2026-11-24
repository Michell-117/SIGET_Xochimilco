import {defineAction,ActionError} from 'astro:actions';
import {z} from 'astro:schema';
import { prisma } from '../../lib/prisma';

export const buscarDomicilioPeticionarioPorCurp = defineAction({

    accept: 'form',

    input: z.object({
        curp: z.string().min(18),
    }),

    handler: async ({curp}) => {

        // Lógica aquí
        const curpVerificada = curp.trim().toUpperCase()

        const Peticionario = await prisma.peticionario.findFirst({
            where: {curp: curpVerificada}
            
        })

        if(!Peticionario){
            throw new ActionError({
                code:'NOT_FOUND',
                message:'Peticionario no encontrado'
            })
        }

        const DomiciliosPeticionario = await prisma.domicilio.findMany({
            where:{
                id_peticionario: Peticionario.id_peticionario
            },
            select:{
                id_domicilio: true,
                calle: true,
                numero_exterior: true,
                asentamiento: {
                    select: {
                        codigo_postal: true,
                    },
                }
            }
        })

        return {
            id_peticionario: Peticionario.id_peticionario,
            nombreCompleto: `${Peticionario.nombre_1} ${Peticionario.nombre_2 ?? ''} ${Peticionario.apellido_1} ${Peticionario.apellido_2}`,
            domicilios: DomiciliosPeticionario
        }

    },

});
