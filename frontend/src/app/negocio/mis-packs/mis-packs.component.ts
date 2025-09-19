import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackService } from '../../core/services/pack.service';
import { AuthService, Usuario } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-packs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-packs.component.html',
  styleUrls: ['./mis-packs.component.css']
})
export class MisPacksComponent implements OnInit {
  packs: any[] = [];
  negocioId: number | null = null;

  constructor(
    private packService: PackService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUsuario(userId).subscribe({
        next: (usuario: Usuario) => {
          this.negocioId = usuario.negocio ? usuario.negocio.id : null;
          if (this.negocioId) {
            this.loadPacks();
          }
        },
        error: (err) => console.error('Error cargando usuario', err)
      });
    }
  }

  loadPacks(): void {
    if (!this.negocioId) return;
    this.packService.getPacksByNegocio(this.negocioId).subscribe({
      next: (data: any[]) => this.packs = data,
      error: (err) => console.error('Error al cargar packs', err)
    });
  }

  editarPack(packId: number): void {
    this.router.navigate(['/negocio/editar-pack', packId]);
  }

  eliminarPack(packId: number): void {
    if (!confirm('¿Seguro que quieres eliminar este pack?')) return;

    this.packService.eliminarPack(packId).subscribe({
      next: () => {
        alert('Pack eliminado con éxito');
        this.loadPacks();
      },
      error: (err) => {
        console.error('Error al eliminar pack', err);
        alert('No se pudo eliminar el pack');
      }
    });
  }

}
