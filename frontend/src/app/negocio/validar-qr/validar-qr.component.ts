import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../core/services/reserva.service';

@Component({
  selector: 'app-validar-qr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validar-qr.component.html',
  styleUrls: ['./validar-qr.component.css']
})
export class ValidarQrComponent {

  codigoQr: string = '';
  mensaje: string | null = null;

  constructor(private reservaService: ReservaService) {}

  validarReserva() {
    if (!this.codigoQr.trim()) {
      this.mensaje = '❌ Ingresa un código QR válido';
      return;
    }

    this.reservaService.validarReserva(this.codigoQr.trim()).subscribe({
      next: (res) => {
        this.mensaje = `✅ Reserva validada: ${res.pack?.titulo} por ${res.usuario?.nombre}`;
        this.codigoQr = '';
      },
      error: (err) => {
        console.error(err);
        this.mensaje = `❌ Error: ${err.error?.message || err.message}`;
      }
    });
  }

  reiniciar() {
    this.codigoQr = '';
    this.mensaje = null;
  }
}
