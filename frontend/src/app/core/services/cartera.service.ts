import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {
  private apiUrl = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 💰 Obtener saldo actual del usuario
  getSaldo(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${userId}/saldo`, {
      headers: this.getAuthHeaders()
    });
  }

  // 💰 Añadir dinero al monedero (simulación)
  agregarDinero(userId: number, cantidad: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${userId}/saldo?cantidad=${cantidad}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
