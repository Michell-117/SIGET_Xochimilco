import { crearUsuario } from "./usuarios/crearUsuario.action";
import { logoutUsuario } from "./usuarios/logoutUsuario";
import { loguearUsuario } from "./usuarios/loguearUsuario.action";

export const server = {
    crearUsuario,
    loguearUsuario,
    logoutUsuario,
}