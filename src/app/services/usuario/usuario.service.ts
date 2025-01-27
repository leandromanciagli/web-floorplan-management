import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`).pipe(delay(500));
  }

  // findByEmail(email: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/usuarios?filter={"where":{"email":${email}}}`).pipe(delay(500));
  // }

  create(usuario: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/usuarios`, usuario).pipe(delay(500));
  }

  update(id: string, usuario: any): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/usuarios/${id}`, usuario).pipe(delay(500));
  }

  delete(id: string): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/usuarios/${id}`).pipe(delay(500));
  }
}
