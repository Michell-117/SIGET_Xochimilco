import {defineAction, ActionError} from 'astro:actions';
import {z} from 'astro:schema';
import { prisma } from '../../lib/prisma';

export const crearDiaInhabil = defineAction({

    accept: 'form',

    input: z.object({
        fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
        descripcion: z.string().trim().min(3, 'La descripción es obligatoria'),
    }),

    handler: async (input) => {

        // Lógica aquí
        const [anio, mes, dia] = input.fecha.split('-').map(Number);
        // Mediodía local evita cualquier desfase de zona horaria al convertir a DATE en PostgreSQL
        const fechaNormalizada = new Date(anio, mes - 1, dia, 12, 0, 0);

        try {
            const nuevoDiaInhabil = await prisma.dias_inhabiles.create({
                data: {
                    fecha: fechaNormalizada,
                    descripcion: input.descripcion.toUpperCase(),
                    // activo: true (si ya tiene default true en BD, no hace falta enviarlo)
                },
            });

            return { ok: true, dia: nuevoDiaInhabil };
        } catch (error) {
            throw new ActionError({
                code:'INTERNAL_SERVER_ERROR',
                message: 'Error al guardar fecha inhábil',
            })
        }

    },

});