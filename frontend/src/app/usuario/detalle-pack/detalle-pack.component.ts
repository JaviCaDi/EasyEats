// detalle-pack.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PackService } from '../../core/services/pack.service';

@Component({
  selector: 'app-detalle-pack',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-pack.component.html',
  styleUrls: ['./detalle-pack.component.css']
})
export class DetallePackComponent implements OnInit {
  pack: any;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private packService: PackService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 🔹 Usamos el nuevo método que devuelve cantidad disponible
    this.packService.getPackDisponibleById(id).subscribe({
      next: (data) => {
        this.pack = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pack', err);
        this.cargando = false;
      }
    });
  }

  getMensajeCantidad(pack: any): string {
    if (!pack || pack.cantidad == null) return '';
    if (pack.cantidad === 0) return 'Agotado';
    if (pack.cantidad === 1) return '¡Última unidad!';
    if (pack.cantidad <= 5) return 'Pocas unidades';
    return 'Disponible';
  }
}
