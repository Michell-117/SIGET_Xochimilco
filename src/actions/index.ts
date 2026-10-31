import { crearUsuario } from "./usuarios/crearUsuario.action";
import { loguearUsuario } from "./usuarios/loguearUsuario.action";

export const server = {
    crearUsuario,
    loguearUsuario,
}