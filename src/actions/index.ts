import { crearDiaInhabil } from "./administracion/crearDiaInhabil.action";
import { buscarAsentamiento } from "./ingresos/buscarAsentamiento.action";
import { buscarCP } from "./ingresos/buscarCP.action";
import { buscarCurp } from "./ingresos/buscarCurp.action";
import { buscarDomicilioPeticionarioPorCurp } from "./ingresos/buscarDomicilio_Y_Peticionario_Curp";
import { buscarPeticionarioPorCurp } from "./ingresos/buscarPeticionario_por_curp.action";
import { consultaDireccionesGenerales } from "./ingresos/consultaDireccionesGenerales.action";
import { consultaRequisitosTramite } from "./ingresos/consultaRequisitosTramite.action";
import { consultaSubTramites } from "./ingresos/consultaSubTramites.action";
import { consultaTramites } from "./ingresos/consultaTramites.action";
import { opcionesPeticionario } from "./ingresos/opcionesPeticionario.action";
import { registrarNuevoDomicilioPeticionario } from "./ingresos/registrarNuevoDomicilioPeticionario.action";
import { registrarPeticionario } from "./ingresos/registrarPeticionario.action";
import { registrarTramite } from "./ingresos/registrarTramite.action";
import { crearUsuario } from "./usuarios/crearUsuario.action";
import { logoutUsuario } from "./usuarios/logoutUsuario";
import { loguearUsuario } from "./usuarios/loguearUsuario.action";

export const server = {
    crearUsuario,
    loguearUsuario,
    logoutUsuario,
    buscarCurp,
    buscarCP,
    buscarAsentamiento,
    registrarPeticionario,
    opcionesPeticionario,
    buscarPeticionarioPorCurp,
    registrarNuevoDomicilioPeticionario,
    buscarDomicilioPeticionarioPorCurp,
    consultaDireccionesGenerales,
    consultaTramites,
    consultaSubTramites,
    consultaRequisitosTramite,
    registrarTramite,
    crearDiaInhabil,
}