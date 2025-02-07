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
        descripcion: "Arquitectura",
      },
      {
        especialidadId: "2",
        descripcion: "Estructura",
      },
      {
        especialidadId: "3",
        descripcion: "Instalación eléctrica",
      },
      {
        especialidadId: "4",
        descripcion: "Instalación sanitaria",
      },
      {
        especialidadId: "5",
        descripcion: "Otro",
      },
    ]
    return especialidades
  }
}
