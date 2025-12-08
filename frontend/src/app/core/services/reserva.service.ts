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

  // Crear reserva real en BD
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

  // Validar reserva por QR
  validarReserva(codigoQr: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/validar/${codigoQr}`,
      { headers: this.getAuthHeaders() }
    );
  }

}
