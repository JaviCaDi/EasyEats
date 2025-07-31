import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get username(): string {
    return this.authService.getUsername() || '';
  }

  get role(): string {
    return this.authService.getRole(); // 'USER', 'BUSINESS', 'ADMIN'
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
