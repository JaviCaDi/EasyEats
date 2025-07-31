import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private userUrl = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient, private router: Router) { }

  // Iniciar sesión
  login(email: string, contraseña: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, contraseña });
  }


  // Registrar nuevo usuario
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Guardar el token en localStorage
  saveToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Obtener el nombre de usuario desde el token
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.nombre || null; // 'sub' suele ser el email o nombre de usuario
    } catch {
      return null;
    }
  }

  // Obtener el rol desde el token
  getRole(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const decoded: any = jwtDecode(token);
      return decoded.rol || ''; // Asegúrate de que el claim se llama 'rol' en tu JWT
    } catch {
      return '';
    }
  }

  // Eliminar la cuenta del usuario autenticado (requiere backend protegido con @PreAuthorize)
  eliminarCuenta() {
    return this.http.delete(`${this.userUrl}/me`);
  }
}
