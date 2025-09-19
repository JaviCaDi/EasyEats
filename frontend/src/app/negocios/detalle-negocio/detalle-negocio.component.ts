import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NegocioService } from '../../core/services/negocio.service';
import { PackService } from '../../core/services/pack.service';

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

  constructor(
    private route: ActivatedRoute,
    private negocioService: NegocioService,
    private packService: PackService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.negocioService.getNegocioById(id).subscribe({
      next: (data) => {
        this.negocio = data;
        this.cargarPacks(id);
      },
      error: (err) => {
        console.error('Error al cargar negocio', err);
        this.cargando = false;
      }
    });
  }

  private cargarPacks(negocioId: number): void {
    this.packService.getPacksByNegocio(negocioId).subscribe({
      next: (data) => {
        this.packs = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar packs', err);
        this.cargando = false;
      }
    });
  }
}
