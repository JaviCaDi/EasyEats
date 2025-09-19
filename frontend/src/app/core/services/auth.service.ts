import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  contraseña?: string;
  telefono?: string;
  direccion?: string;
  rol?: any;
  // 👇 añadir el objeto negocio
  negocio?: {
    id: number;
    nombre: string;
    direccion?: string;
    horario?: string;
    descripcion?: string;
    imagen_url?: string;
  };
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private userUrl = 'http://localhost:8080/api/usuario';
  private negocioUrl = 'http://localhost:8080/api/negocio';

  constructor(private http: HttpClient, private router: Router) { }

  crearNegocio(data: any) {
    return this.http.post(this.negocioUrl, data);
  }

  login(email: string, contraseña: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, contraseña });
  }

  register(data: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.nombre || null;
    } catch {
      return null;
    }
  }

  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const decoded: any = jwtDecode(token);
      return decoded.rol || '';
    } catch {
      return '';
    }
  }

  eliminarCuenta() {
    return this.http.delete(`${this.userUrl}/me`);
  }

  getUsuario(id: number): Observable<Usuario> {
    const token = this.getToken();
    return this.http.get<Usuario>(`${this.userUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  asignarNegocio(usuarioId: number, negocioId: number) {
    return this.http.put<Usuario>(`${this.userUrl}/${usuarioId}/negocio/${negocioId}`, {});
  }


  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || null;
    } catch {
      return null;
    }
  }

}
