import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProvinciaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): any[] {
    let provincias = [
      {
        provinciaId: "1",
        nombre: "Buenos Aires",
      },
      {
        provinciaId: "2",
        nombre: "La Pampa",
      },
      {
        provinciaId: "3",
        nombre: "Catamarca",
      },
      {
        provinciaId: "4",
        nombre: "La Rioja",
      },
      {
        provinciaId: "5",
        nombre: "Salta",
      },
      {
        provinciaId: "6",
        nombre: "Neuquén",
      },
      {
        provinciaId: "7",
        nombre: "Mendoza",
      },
      {
        provinciaId: "8",
        nombre: "Chubut",
      },
      {
        provinciaId: "9",
        nombre: "Santa Cruz",
      },
      {
        provinciaId: "10",
        nombre: "Tierra del Fuego",
      },
      {
        provinciaId: "11",
        nombre: "Santa Fe",
      },
      {
        provinciaId: "12",
        nombre: "Entre Ríos",
      },
      {
        provinciaId: "13",
        nombre: "Formosa",
      },
      {
        provinciaId: "14",
        nombre: "Río Negro",
      },
      {
        provinciaId: "15",
        nombre: "Tucumán",
      },
      {
        provinciaId: "16",
        nombre: "San Luis",
      },
      {
        provinciaId: "17",
        nombre: "San Juan",
      },
      {
        provinciaId: "18",
        nombre: "Córdoba",
      },
      {
        provinciaId: "19",
        nombre: "Misiones",
      },
      {
        provinciaId: "20",
        nombre: "Santiago del Estero",
      },
      {
        provinciaId: "21",
        nombre: "Chaco",
      },
      {
        provinciaId: "22",
        nombre: "Corrientes",
      },
      {
        provinciaId: "23",
        nombre: "Jujuy",
      },
    ]
    return provincias
  }
}
