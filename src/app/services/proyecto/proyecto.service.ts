import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proyecto`).pipe(delay(500));
  }

  create(proyecto: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/proyecto`, proyecto).pipe(delay(500));
  }

  update(id: string, proyecto: any): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/proyecto/${id}`, proyecto).pipe(delay(500));
  }

  delete(id: string): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/proyecto/${id}`).pipe(delay(500));
  }
}
