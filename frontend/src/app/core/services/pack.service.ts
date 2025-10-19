import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PackService {
  private apiUrl = 'http://localhost:8080/api/packs';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Crear pack
  crearPack(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener todos los packs de un negocio
  getPacksByNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/negocio/${negocioId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener un pack por id
  getPackById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualizar pack
  actualizarPack(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Eliminar pack
  eliminarPack(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener packs con cantidad disponible actual (desde packs_disponibles)
  getPacksDisponiblesByNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/negocio/${negocioId}/disponibles`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener un pack por id con cantidad disponible actual
  getPackDisponibleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/disponible`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener horarios de un pack
  getHorariosByPackId(packId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${packId}/horarios`, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualizar horarios de un pack
  actualizarHorarios(packId: number, horarios: { horaInicio: string, horaFin: string }[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${packId}/horarios`, horarios, {
      headers: this.getAuthHeaders()
    });
  }
}
