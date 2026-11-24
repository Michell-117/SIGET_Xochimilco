import {addDays, isWeekend, format} from 'date-fns';

export const sumarDiasHabiles = ( fechaInicio: Date, diasHabiles: number, diasInhabiles: string[] ):Date =>{
    
    let fechaActual = new Date(fechaInicio);
    let diasSumados = 0;

    while(diasSumados< diasHabiles){

        fechaActual = addDays(fechaActual, 1);

        const fechaTexto = format(fechaActual, 'yyyy-MM--dd');

        const esFinDeSemana = isWeekend(fechaActual);
        const esNoLaboral = diasInhabiles.includes(fechaTexto)

        if(!esFinDeSemana && !esNoLaboral){
            diasSumados++;
        }
    }
    return fechaActual

}