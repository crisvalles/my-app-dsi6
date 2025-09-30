import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dniFormat',
  standalone: true
})
export class DniFormatPipe implements PipeTransform {
  transform(value: string): string {
    if(!value) return '';

    //Limpiar: quietar todo lo que no sea digito
    const cleanValue = value.replace(/\D/g,'');

    //Si tiene 8 digitos, decolverlos sin formato
    if(cleanValue.length ===8) {
      return cleanValue;
    }

    //Si no tiene 8 digitos, devolver el valor limpio
    return cleanValue;
  }

}
