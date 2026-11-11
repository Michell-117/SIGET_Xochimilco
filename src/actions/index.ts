import { buscarAsentamiento } from "./ingresos/buscarAsentamiento.action";
import { buscarCP } from "./ingresos/buscarCP.action";
import { buscarCurp } from "./ingresos/buscarCurp.action";
import { opcionesPeticionario } from "./ingresos/opcionesPeticionario.action";
import { registrarPeticionario } from "./ingresos/registrarPeticionario.action";
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
}