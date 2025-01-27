import { Injectable } from '@angular/core';
import swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  async displaySuccessMessage(
    msg = 'Información guardada correctamente',
    text = ''
  ) {
    await swal.fire({
      icon: 'success',
      title: msg,
      text: text,
      allowOutsideClick: false,
      showConfirmButton: true,
      // timer: 1700,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3B6472',
    })
  }

  async displayErrorMessage(
    msg = '¡Ocurrió un error!',
    text = 'Por favor intentá nuevamente. Si el problema persiste, comunicate con el administrador del sistema.',
  ) {
    await swal.fire({
      icon: 'error',
      title: msg,
      text: text,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3B6472',
    })
  }

  async displayDeleteMessage(
    nombreItem: string,
    text: string = '¿Estás seguro/a?',
  ) {
    const result = await swal.fire({
      title: 'Eliminar ' + nombreItem,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#3B6472',
      cancelButtonColor: '#a39fa7',
    })
    return result
  }

  async displayQuestion(title: string, subtitle: string = '¿Estás seguro/a?') {
    const result = await swal.fire({
      title: title,
      text: subtitle,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#3B6472',
      cancelButtonColor: '#a39fa7',
    })
    return result
  }

  // async displayInput(options) {
  //   const result = await swal.fire({
  //     inputValue: options.defaultValue ? options.defaultValue : '',
  //     title: options.title,
  //     html: options.subtitle,
  //     input: options.inputType,
  //     icon: 'question',
  //     showCancelButton: true,
  //     allowOutsideClick: false,
  //     confirmButtonText: 'Aceptar',
  //     cancelButtonText: 'Cancelar',
  //     reverseButtons: true,
  //     confirmButtonColor: '#3B6472',
  //     cancelButtonColor: '#a39fa7',
  //     inputValidator: (value) => {
  //       if (options.validation.required && !value) {
  //         return options.validation.text
  //       }
  //     }
  //   })
  //   return result
  // }
}
