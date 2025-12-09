import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../core/services/reserva.service';
import { AuthService, Usuario } from '../../core/services/auth.service';

@Component({
  selector: 'app-reservas-recibidas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-recibidas.component.html',
  styleUrls: ['./reservas-recibidas.component.css']
})
export class ReservasRecibidasComponent implements OnInit {

  pendientes: any[] = [];
  recogidas: any[] = [];
  negocioId!: number;

  constructor(
    private reservaService: ReservaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error("Usuario no logueado");
      return;
    }

    // Obtener el usuario completo con su negocio
    this.authService.getUsuario(userId).subscribe({
      next: (usuario: Usuario) => {
        if (usuario.negocio && usuario.negocio.id) {
          this.negocioId = usuario.negocio.id;
          this.cargarReservas();
        } else {
          console.error("El usuario no tiene un negocio asociado");
        }
      },
      error: (err) => console.error("Error al obtener usuario:", err)
    });
  }

  cargarReservas() {
    this.reservaService.getPendientesNegocio(this.negocioId).subscribe({
      next: res => this.pendientes = res,
      error: err => console.error("Error al cargar pendientes:", err)
    });

    this.reservaService.getRecogidasNegocio(this.negocioId).subscribe({
      next: res => this.recogidas = res,
      error: err => console.error("Error al cargar recogidas:", err)
    });
  }
}
