import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';


@Pipe({
    standalone: true,
    name: 'formatDate'
})
export class CustomDatePipe implements PipeTransform {
    transform(fecha: string ): string {
        return fecha ? moment(fecha, 'DD-MM-YYYY').format('DD/MM/YYYY') : '-'
    }
}

