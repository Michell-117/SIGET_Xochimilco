interface Requisito {
    id_tramite:string;
    id_requisito: number;
    nombre_requisito: string;
    descripcion: string | null;
}

export const crearTarjetaRequisitoHTML = (req: Requisito): string =>{
    return `
        <div class="col-span-full rounded-xl border border-slate-200 bg-white p-3.5 transition-all hover:border-slate-300">

            <div class="flex items-center justify-between gap-4">

                <div class="flex-1 leading-snug">
                    <span class="text-sm font-semibold text-slate-800">
                        ${req.nombre_requisito}
                    </span>
                    ${
                        req.descripcion
                            ? `<button type="button" aria-expanded="false" title="Ver descripción" class="btn-toggle-desc ml-2 inline-flex h-6 w-6 align-middle items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-orange-600 transition-all hover:bg-orange-600 hover:text-white">
                                <svg class="icono-plus h-3.5 w-3.5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                </svg>
                                </button>`
                            : ''
                    }
                </div>

                <div class="inline-flex shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
                    <label class="cursor-pointer">
                        <input type="radio" name="${req.id_requisito}_${req.id_tramite}" value="true" class="peer sr-only" required />
                        <span class="block rounded-md px-3 py-1.5 text-slate-600 transition-all peer-checked:bg-orange-600 peer-checked:text-white">
                            Entregado
                        </span>
                    </label>

                    <label class="cursor-pointer">
                        <input type="radio" name="${req.id_requisito}_${req.id_tramite}" value="false" class="peer sr-only" />
                        <span class="block rounded-md px-3 py-1.5 text-slate-600 transition-all peer-checked:bg-slate-700 peer-checked:text-white">
                            Faltante
                        </span>
                    </label>
                </div>

            </div>

            ${
            req.descripcion
                ? `<div class="desc-requisito hidden mt-3 border-t border-slate-100 pt-2.5 text-xs leading-relaxed text-slate-600">
                    ${req.descripcion}
                    </div>`
                : ''
            }

        </div>
    `;
}