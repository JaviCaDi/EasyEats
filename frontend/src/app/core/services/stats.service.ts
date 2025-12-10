import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasNegocioService {

  private apiUrl = 'http://localhost:8080/api/estadisticas';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getTotalReservas(negocioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${negocioId}/total-reservas`, { headers: this.getAuthHeaders() });
  }

  getIngresosHoy(negocioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${negocioId}/ingresos-hoy`, { headers: this.getAuthHeaders() });
  }

  getIngresosTotales(negocioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${negocioId}/ingresos-totales`, { headers: this.getAuthHeaders() });
  }

  getTop5Packs(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${negocioId}/top5packs`, { headers: this.getAuthHeaders() });
  }

  getPromedioReservasDiarias(negocioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${negocioId}/promedio-reservas`, { headers: this.getAuthHeaders() });
  }

  getClienteMasPopular(negocioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${negocioId}/cliente-popular`, { headers: this.getAuthHeaders() });
  }

  getReservaReciente(negocioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${negocioId}/reserva-reciente`, { headers: this.getAuthHeaders() });
  }

  getPackMayorIngreso(negocioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${negocioId}/pack-mayoringreso`, { headers: this.getAuthHeaders() });
  }

  getIngresosPorPack(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${negocioId}/ingresos-por-pack`, { headers: this.getAuthHeaders() });
  }
}
