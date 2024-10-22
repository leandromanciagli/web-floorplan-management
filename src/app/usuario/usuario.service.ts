import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`)
  }

  create(usuario: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/usuarios`, usuario)
  }

  update(id: string, usuario: any): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/usuarios/${id}`, usuario)
  }

  delete(id: string): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/usuarios/${id}`)
  }
}
