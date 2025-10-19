// src/app/core/services/cartera.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {
  private apiUrl = 'http://localhost:8080/api/cartera';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Obtener saldo actual del usuario
  getSaldo(userId: number): Observable<number> {
    return this.http.get<{ saldo: number }>(`${this.apiUrl}/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(map(res => res.saldo));
  }

  // Simular añadir dinero (desde el frontend)
  agregarDinero(userId: number, cantidad: number): Observable<number> {
    return this.http.post<{ nuevoSaldo: number }>(
      `${this.apiUrl}/${userId}/agregar`,
      { cantidad },
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.nuevoSaldo));
  }
}
