import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NegocioService } from '../../core/services/negocio.service';
import { PackService } from '../../core/services/pack.service';
import ColorThief from 'colorthief';

@Component({
  selector: 'app-detalle-negocio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-negocio.component.html',
  styleUrls: ['./detalle-negocio.component.css']
})
export class DetalleNegocioComponent implements OnInit {
  negocio: any;
  packs: any[] = [];
  cargando = true;
  colorFondo: string = '#cccccc';

  constructor(
    private route: ActivatedRoute,
    private negocioService: NegocioService,
    private packService: PackService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.negocioService.getNegocioById(id).subscribe({
      next: (data) => {
        this.negocio = data;
        this.cargarPacks(id);

        if (data.imagenUrl) {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = 'http://localhost:8080' + data.imagenUrl;

          img.onload = () => {
            const colorThief = new ColorThief();
            const color = colorThief.getColor(img);
            this.colorFondo = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          };
        }
      },
      error: (err) => {
        console.error('Error al cargar negocio', err);
        this.cargando = false;
      }
    });
  }

  private cargarPacks(negocioId: number): void {
    this.packService.getPacksDisponiblesByNegocio(negocioId).subscribe({
      next: (data) => {
        this.packs = data.filter((pack: any) => pack.activo);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar packs disponibles', err);
        this.cargando = false;
      }
    });
  }


  // Función para mostrar mensaje según cantidad
  getMensajeCantidad(pack: any): string {
    if (pack.cantidad === 0) return 'Agotado';
    if (pack.cantidad === 1) return 'Última unidad';
    if (pack.cantidad <= 5) return 'Pocas unidades disponibles';
    return '';
  }
}
