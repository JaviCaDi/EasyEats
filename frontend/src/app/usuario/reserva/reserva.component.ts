import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PackService } from '../../core/services/pack.service';
import { CarteraService } from '../../core/services/cartera.service';
import { AuthService } from '../../core/services/auth.service';
import { ReservaService } from '../../core/services/reserva.service';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  pack: any;
  saldo: number = 0;
  cargando = true;
  userId: number | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packService: PackService,
    private carteraService: CarteraService,
    private authService: AuthService,
    private reservaService: ReservaService   // <-- AÑADIDO
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = this.authService.getUserId();

    if (!this.userId) {
      this.error = 'No se encontró el usuario. Por favor inicia sesión.';
      this.cargando = false;
      return;
    }

    this.packService.getPackDisponibleById(id).subscribe({
      next: (data) => {
        this.pack = data;
        this.cargarSaldo();
      },
      error: (err) => {
        console.error('Error al cargar el pack', err);
        this.error = 'No se pudo cargar la información del pack.';
        this.cargando = false;
      }
    });
  }

  cargarSaldo(): void {
    if (!this.userId) return;

    this.carteraService.getSaldo(this.userId).subscribe({
      next: (saldo) => {
        this.saldo = saldo ?? 0;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar el saldo', err);
        this.error = 'Error al cargar tu saldo.';
        this.cargando = false;
      }
    });
  }

  puedeReservar(): boolean {
    return this.saldo >= (this.pack?.precio ?? 0);
  }

  confirmarReserva(): void {
    if (!this.pack || !this.userId) return;

    if (!this.puedeReservar()) {
      alert('❌ No tienes suficiente saldo para esta reserva.');
      return;
    }

    this.reservaService.hacerReserva(this.pack.id).subscribe({
      next: () => {
        alert(`✅ Reserva confirmada para el pack "${this.pack.titulo}" por ${this.pack.precio} €`);
        this.router.navigate(['/mis-reservas']);
      },
      error: (err) => {
        console.error('Error al hacer la reserva:', err);
        alert('❌ Ocurrió un error al realizar la reserva.');
      }
    });
  }
}
