// src/app/features/cartera/cartera.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarteraService } from '../../core/services/cartera.service';
import { AuthService, Usuario } from '../../core/services/auth.service';

@Component({
  selector: 'app-cartera',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cartera.component.html',
  styleUrls: ['./cartera.component.css']
})
export class CarteraComponent implements OnInit {
  saldo: number = 0;
  cantidadAgregar: number = 0;
  cargando = true;
  userId: number | null = null;

  constructor(
    private carteraService: CarteraService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.authService.getUserId();
    if (id) {
      this.userId = id;
      this.obtenerSaldo();
    } else {
      console.error('No se encontró el userId');
      this.cargando = false;
    }
  }

  obtenerSaldo(): void {
    if (!this.userId) return;
    this.carteraService.getSaldo(this.userId).subscribe({
      next: (saldo) => {
        this.saldo = saldo;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener saldo', err);
        this.cargando = false;
      }
    });
  }

  agregarDinero(): void {
    if (this.cantidadAgregar <= 0 || !this.userId) return;

    this.carteraService.agregarDinero(this.userId, this.cantidadAgregar).subscribe({
      next: (nuevoSaldo) => {
        this.saldo = nuevoSaldo;
        this.cantidadAgregar = 0;
        alert('✅ Dinero agregado correctamente');
      },
      error: (err) => {
        console.error('Error al agregar dinero', err);
        alert('❌ No se pudo agregar dinero');
      }
    });
  }
}
