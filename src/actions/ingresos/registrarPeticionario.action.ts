import {defineAction, ActionError} from 'astro:actions';
import {z} from 'astro:schema';
import {prisma} from '../../lib/prisma';

export const registrarPeticionario = defineAction({

    accept: 'form',

    input: z.object({
        // Campos obligatorios del peticionario
        nombre_1: z.string().min(1, 'El primer nombre es obligatorio'),
        nombre_2: z.string().nullable().optional().transform((val) => val || null),
        apellido_1: z.string().min(1, 'El primer apellido es obligatorio'),
        apellido_2: z.string().nullable().optional().transform((val) => val || null),
        curp: z.string().length(18, 'La CURP debe tener 18 caracteres'),
        numero_identificacion: z.string().nullable().optional().transform((val) => val || null),
        
        // Fecha de nacimiento: se asegura de recibir un string no vacío
        fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
        
        id_tipo_identificacion: z.coerce.number().int(),
        id_nacionalidad: z.coerce.number().int(),
        id_genero: z.coerce.number().int(),
        id_tipo_persona: z.coerce.number().int(),

        // Campos del domicilio
        calle: z.string().min(1, 'La calle es obligatoria'),
        numero_exterior: z.string().nullable().optional().transform((val) => val || null),
        
        // AHORA ACEPTAN NULL GRACIAS A .nullable()
        numero_interior: z.string().nullable().optional().transform((val) => val || null),
        calle1: z.string().nullable().optional().transform((val) => val || null),
        calle2: z.string().nullable().optional().transform((val) => val || null),
        
        id_asentamiento: z.coerce.number().int(),
    }),

    handler: async (input) => {

        // Lógica aquí
        try {
            
            const resultado = await prisma.$transaction(async (tx) => {
                // Crear Peticionario
                const nuevoPeticionario = await tx.peticionario.create({
                    data: {
                        nombre_1: input.nombre_1?.toUpperCase(),
                        nombre_2: input.nombre_2?.toUpperCase(),
                        apellido_1: input.apellido_1?.toUpperCase(),
                        apellido_2: input.apellido_2?.toUpperCase(),
                        curp: input.curp.toUpperCase(),
                        numero_identificacion: input.numero_identificacion,
                        fecha_nacimiento: new Date(input.fecha_nacimiento),
                        id_tipo_identificacion: input.id_tipo_identificacion,
                        id_nacionalidad: input.id_nacionalidad,
                        id_genero: input.id_genero,
                        id_tipo_persona: input.id_tipo_persona,
                    },
                });

                //  Crear Domicilio usando el id_peticionario 
                const nuevoDomicilio = await tx.domicilio.create({
                    data: {
                        calle: input.calle.toUpperCase(),
                        numero_exterior: input.numero_exterior,
                        numero_interior: input.numero_interior,
                        calle1: input.calle1,
                        calle2: input.calle2,
                        id_asentamiento: input.id_asentamiento,
                        id_peticionario: nuevoPeticionario.id_peticionario, // Foreign Key UUID
                    },
                });

                return { peticionario: nuevoPeticionario, domicilio: nuevoDomicilio };
            });

            return { success: true, data: resultado, message: 'Peticionario guardado exitosamente.' };

        } catch (error: any) {
            // Imprime el fallo real en la terminal de desarrollo
            console.error('=== ERROR DETALLADO DE PRISMA ===');
            console.error(error);

            throw new ActionError({
                code: 'INTERNAL_SERVER_ERROR',
                // Te mostrará en pantalla la razón exacta (ej. Foreign Key fallida, Registro duplicado, etc.)
                message: error?.message || 'Error en la base de datos.',
            });
        }
    },

});
