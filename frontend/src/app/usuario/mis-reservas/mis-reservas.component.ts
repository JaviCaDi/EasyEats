import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservaService } from '../../core/services/reserva.service';
import { AuthService } from '../../core/services/auth.service';

// IMPORT CORRECTO para Angular 19: el componente standalone
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  // añadimos QRCodeComponent en imports (no QRCodeModule)
  imports: [CommonModule, RouterModule, QRCodeComponent],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {

  reservas: any[] = [];
  cargando = true;
  error: string | null = null;
  userId: number | null = null;

  constructor(
    private reservaService: ReservaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (!this.userId) {
      this.error = 'No se pudo identificar al usuario.';
      this.cargando = false;
      return;
    }

    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.getMisReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar tus reservas.';
        this.cargando = false;
      }
    });
  }
}
