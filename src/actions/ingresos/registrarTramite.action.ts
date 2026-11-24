import {defineAction, ActionError} from 'astro:actions';
import {number, z} from 'astro:schema';
import { sumarDiasHabiles } from '../../utils/fechasTramite';
import { prisma } from '../../lib/prisma';
import { addDays } from 'date-fns';

export const registrarTramite = defineAction({

    input: z.object({
        dias_respuesta: z.number().int().positive(),
        folio: z.string(),
        id_catalogo_tramite: z.number().int().positive(),
        id_domicilio: z.number().int().positive(),
        id_peticionario: z.string(),
        requisitos:z.array(
            z.object({
                id_requisito: z.number().int().positive(),
                id_tramite: z.number().int().positive(),
                entregado: z.boolean(),
            })
            
        ).min(1, 'Debe incluirse al menos un requisito')
    }),

    handler: async (input, context) => {

        // Tomamos del context el id del usuario del sistema
        const id_usuario_captura = context.locals.usuario?.id

        // ======================
        // Manejo de fechas
        // ======================
        const hoy = new Date() // Fecha en que se guarda tramite
        const fechaTramiteFormateada = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) // Fecha en que se guarda tramite

        const diasInhabiles = await prisma.dias_inhabiles.findMany({
            where:{
                activo: true,
                fecha: {gte: fechaTramiteFormateada}
            },
            select:{fecha:true}
        })

        // formateamos el arreglo de objetos de los diasInhabiles y creamos un arreglo de strings
        const listaDiasInhabiles = diasInhabiles.map( (dia) => dia.fecha.toISOString().split('T')[0] );
        // Calculamos la fecha compromiso con la funcion sumarDiasHabiles
        const fecha_compromiso = sumarDiasHabiles(hoy, input.dias_respuesta, listaDiasInhabiles);
        const fecha_caducidad_conteo = addDays(hoy,90);

        // Realizamos el create en las dos tablas de manera anidada, primero en la de tramites y luego en la de requisitos
        // Validar que exista sesión antes de intentar guardar
        if (!id_usuario_captura) {
            throw new ActionError({
                code: 'UNAUTHORIZED',
                message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            });
        }

        try {
            const nuevoTramite = await prisma.tramites_registro.create({
                data: {
                    folio: input.folio,
                    id_peticionario: input.id_peticionario,
                    id_catalogo_tramite: input.id_catalogo_tramite,
                    id_domicilio: input.id_domicilio,
                    id_usuario_captura: id_usuario_captura,
                    // id_status_actual no hace falta enviarlo porque PostgreSQL le asigna 1 por defecto
                    fecha_ingreso: hoy,
                    fecha_compromiso: fecha_compromiso,
                    fecha_caducidad_conteo: fecha_caducidad_conteo,

                    // Inserta todos los requisitos asociados usando el UUID recién generado
                    tramite_requisitos_entregados: {
                        createMany: {
                            data: input.requisitos.map((req) => ({
                                id_tramite: req.id_tramite,
                                id_requisito: req.id_requisito,
                                entregado: req.entregado,
                                fecha_entrega: req.entregado ? hoy : null,
                            })),
                        },
                    },
                },
                select: {
                    id_tramite_registro: true,
                    folio: true,
                    fecha_compromiso: true,
                    fecha_caducidad_conteo: true,
                },
            });

            // Dentro del return de tu Action:
            return {
                ok: true,
                tramite: {
                    id_tramite_registro: nuevoTramite.id_tramite_registro,
                    folio: nuevoTramite.folio,
                    // Extrae '2027-01-04' directo de ISO UTC (sin desfase) o con format() antes de guardar
                    fecha_compromiso: nuevoTramite.fecha_compromiso.toISOString().split('T')[0],
                    fecha_caducidad_conteo: nuevoTramite.fecha_caducidad_conteo.toISOString().split('T')[0],
                },
            };

        } catch (error: any) {
            // Manejo específico por si el folio ya existe en la base de datos (error P2002 de Prisma)
            if (error.code === 'P2002') {
                throw new ActionError({
                code: 'CONFLICT',
                message: `El folio "${input.folio}" ya se encuentra registrado.`,
                });
            }

            console.error('Error al registrar trámite:', error);

            throw new ActionError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Ocurrió un error al guardar el trámite en la base de datos.',
            });
        }
    },

});