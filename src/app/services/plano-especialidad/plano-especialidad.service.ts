import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanoEspecialidadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): any[] {
    let especialidades = [
      {
        especialidadId: "1",
        nombre: "Arquitectura",
      },
      {
        especialidadId: "2",
        nombre: "Estructura",
      },
      {
        especialidadId: "3",
        nombre: "Instalación eléctrica",
      },
      {
        especialidadId: "4",
        nombre: "Instalación sanitaria",
      },
      {
        especialidadId: "5",
        nombre: "Otro",
      },
    ]
    return especialidades
  }
}
