import {defineAction,ActionError} from "astro:actions"
import { prisma } from "../../lib/prisma";

export const opcionesPeticionario = defineAction({

    handler: async () => {

        const tipos_identificacion = await prisma.tipo_identificacion.findMany();
        const tipos_nacionalidad = await prisma.nacionalidades.findMany();;
        const tipos_genero = await prisma.generos.findMany();
        const tipos_persona = await prisma.tipo_persona.findMany();

        if (tipos_identificacion.length===0) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'Error: tipos_identificacion'
            })
        }
        if (tipos_nacionalidad.length===0) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'Error: tipos_nacionalidad'
            })
        }
        if (tipos_genero.length===0) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'Error: tipos_genero'
            })
        }
        if (tipos_persona.length===0) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'Error: tipos_persona'
            })
        }

        const tipos_id = tipos_identificacion.map( (identificacion)=>({
            valor: identificacion.id_tipo_identificacion,
            texto: identificacion.tipo_identificacion,
        }));
        const tipos_na = tipos_nacionalidad.map( (nacionalidad)=>({
            valor: nacionalidad.id_nacionalidad,
            texto: nacionalidad.nacionalidad,
        }));
        const tipos_g = tipos_genero.map( (genero)=>({
            valor: genero.id_genero,
            texto: genero.genero,
        }));
        const tipos_p = tipos_persona.map( (persona)=>({
            valor: persona.id_tipo_persona,
            texto: persona.tipo_persona,
        }));

        return {
            tipos_id,
            tipos_na,
            tipos_g,
            tipos_p,
        }
    },

});