import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Crear reserva en backend
  hacerReserva(packId: number): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.post(
      `${this.apiUrl}/${userId}/${packId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener reservas del usuario
  getMisReservas(): Observable<any[]> {
    const userId = this.authService.getUserId();
    return this.http.get<any[]>(
      `${this.apiUrl}/usuario/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Validar QR
  validarReserva(codigoQr: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/validar/${codigoQr}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener todas las reservas de un negocio
  getReservasNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/negocio/${negocioId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Reservas pendientes
  getPendientesNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/negocio/${negocioId}/pendientes`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Reservas recogidas
  getRecogidasNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/negocio/${negocioId}/recogidas`,
      { headers: this.getAuthHeaders() }
    );
  }

}
