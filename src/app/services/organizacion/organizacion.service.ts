import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/organizaciones`).pipe(delay(500));
  }

  create(organizacion: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/organizaciones`, organizacion).pipe(delay(500));
  }

  update(id: string, organizacion: any): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/organizaciones/${id}`, organizacion).pipe(delay(500));
  }

  delete(id: string): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/organizaciones/${id}`).pipe(delay(500));
  }
}
