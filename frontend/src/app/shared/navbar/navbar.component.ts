import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, Usuario } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuario?: Usuario;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn() && this.authService.getRole() === 'ROLE_BUSINESS') {
      const id = this.authService.getUserId();
      if (id) {
        this.authService.getUsuario(id).subscribe(u => {
          // Mapear negocio.id a negocioId
          this.usuario = {
            ...u,
            negocioId: (u as any).negocio ? (u as any).negocio.id : null
          };
        });
      }
    }
  }


  tieneNegocio(): boolean {
    return !!this.usuario?.negocioId;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get username(): string {
    return this.authService.getUsername() || '';
  }

  get role(): string {
    return this.authService.getRole();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  eliminarCuenta() {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.')) {
      this.authService.eliminarCuenta().subscribe({
        next: () => {
          alert('Cuenta eliminada.');
          this.logout();
        },
        error: () => {
          alert('Error al eliminar la cuenta.');
        }
      });
    }
  }
}
