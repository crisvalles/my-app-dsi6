import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if(!value) return '';

    const cleanValue = value.replace(/\D/g,'');

    //Formatear números peruanos (9 digitos)
    if(cleanValue.length === 9) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return value;
  }

}
