import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PackService } from '../../core/services/pack.service';
import { AuthService, Usuario } from '../../core/services/auth.service';

@Component({
  selector: 'app-horario-packs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario-packs.component.html',
  styleUrls: ['./horario-packs.component.css']
})
export class HorarioPacksComponent implements OnInit {
  packs: any[] = [];
  horarios: { [key: number]: { horaInicio: string; horaFin: string }[] } = {};
  cargando = true;
  guardando = false;
  negocioId: number | null = null;

  constructor(
    private packService: PackService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUsuario(userId).subscribe({
        next: (usuario: Usuario) => {
          this.negocioId = usuario.negocio ? usuario.negocio.id : null;
          if (this.negocioId) {
            this.cargarPacks();
          } else {
            console.warn('⚠️ El usuario no tiene negocio asociado');
            this.cargando = false;
          }
        },
        error: (err) => {
          console.error('Error cargando usuario', err);
          this.cargando = false;
        }
      });
    } else {
      console.error('No se encontró userId en AuthService');
      this.cargando = false;
    }
  }

  cargarPacks(): void {
    if (!this.negocioId) return;

    this.packService.getPacksByNegocio(this.negocioId).subscribe({
      next: (data) => {
        this.packs = data;
        this.cargarHorariosDePacks();
      },
      error: (err) => {
        console.error('Error al cargar packs:', err);
        this.cargando = false;
      }
    });
  }

  cargarHorariosDePacks(): void {
    let pendientes = this.packs.length;
    if (pendientes === 0) {
      this.cargando = false;
      return;
    }

    this.packs.forEach((pack) => {
      this.packService.getHorariosByPackId(pack.id).subscribe({
        next: (horarios) => {
          this.horarios[pack.id] = horarios.length
            ? horarios.map((h) => ({
                horaInicio: h.horaInicio,
                horaFin: h.horaFin
              }))
            : [{ horaInicio: '', horaFin: '' }];
        },
        error: () => {
          this.horarios[pack.id] = [{ horaInicio: '', horaFin: '' }];
        },
        complete: () => {
          pendientes--;
          if (pendientes === 0) this.cargando = false;
        }
      });
    });
  }

  agregarHorario(packId: number): void {
    this.horarios[packId].push({ horaInicio: '', horaFin: '' });
  }

  eliminarHorario(packId: number, index: number): void {
    this.horarios[packId].splice(index, 1);
  }

  guardarHorarios(): void {
    this.guardando = true;

    const peticiones = this.packs.map((pack) => {
      const horariosValidos = this.horarios[pack.id].filter(
        (h) => h.horaInicio && h.horaFin
      );
      return this.packService.actualizarHorarios(pack.id, horariosValidos);
    });

    Promise.all(peticiones.map((obs) => obs.toPromise()))
      .then(() => alert('✅ Horarios guardados correctamente'))
      .catch((err) => {
        console.error('Error al guardar horarios:', err);
        alert('❌ Error al guardar horarios');
      })
      .finally(() => (this.guardando = false));
  }
}
