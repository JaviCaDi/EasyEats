import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NegocioService } from '../../core/services/negocio.service';

@Component({
  selector: 'app-listar-negocios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-negocios.component.html',
  styleUrls: ['./listar-negocios.component.css']
})
export class ListarNegociosComponent implements OnInit {
  negocios: any[] = [];
  cargando = true;

  constructor(private negocioService: NegocioService) {}

  ngOnInit(): void {
    this.negocioService.getNegocios().subscribe({
      next: (data) => {
        this.negocios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar negocios', err);
        this.cargando = false;
      }
    });
  }
}
