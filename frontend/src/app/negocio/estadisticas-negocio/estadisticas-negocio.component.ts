import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasNegocioService } from '../../core/services/stats.service';
import { AuthService, Usuario } from '../../core/services/auth.service';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-estadisticas-negocio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-negocio.component.html',
  styleUrls: ['./estadisticas-negocio.component.css']
})
export class EstadisticasNegocioComponent implements OnInit {

  negocioId!: number;

  totalReservas = 0;
  ingresosHoy = 0;
  ingresosTotales = 0;
  promedioReservas = 0;

  clientePopular: any;
  reservaReciente: any;
  packMayorIngreso: any;

  chartTopPacks!: Chart;
  chartMayorIngreso!: Chart;
  ingresosPacks: any[] = [];

  constructor(
    private estadisticasService: EstadisticasNegocioService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error("Usuario no logueado");
      return;
    }

    this.authService.getUsuario(userId).subscribe({
      next: (usuario: Usuario) => {
        if (usuario.negocio && usuario.negocio.id) {
          this.negocioId = usuario.negocio.id;
          this.cargarEstadisticas();
        } else {
          console.error("El usuario no tiene un negocio asociado");
        }
      },
      error: (err) => console.error("Error al obtener usuario:", err)
    });
  }

  cargarEstadisticas() {
    this.estadisticasService.getTotalReservas(this.negocioId).subscribe(r => this.totalReservas = r);
    this.estadisticasService.getIngresosHoy(this.negocioId).subscribe(r => this.ingresosHoy = r);
    this.estadisticasService.getIngresosTotales(this.negocioId).subscribe(r => this.ingresosTotales = r);
    this.estadisticasService.getPromedioReservasDiarias(this.negocioId).subscribe(r => this.promedioReservas = r);

    this.estadisticasService.getClienteMasPopular(this.negocioId).subscribe(r => this.clientePopular = r);
    this.estadisticasService.getReservaReciente(this.negocioId).subscribe(r => this.reservaReciente = r);

    // Obtener todos los packs con sus ingresos
    this.estadisticasService.getIngresosPorPack(this.negocioId).subscribe(packs => {
      this.ingresosPacks = packs;

      // Obtener pack con mayor ingreso
      this.estadisticasService.getPackMayorIngreso(this.negocioId).subscribe(p => {
        this.packMayorIngreso = p;
        this.generarGraficoMayorIngreso();
      });
    });

    // Top 5 packs más reservados
    this.estadisticasService.getTop5Packs(this.negocioId).subscribe(data => {
      this.generarGraficoTopPacks(data);
    });
  }

  generarGraficoTopPacks(data: any[]) {
    if (this.chartTopPacks) this.chartTopPacks.destroy();

    const colores = ['#2C6EFC', '#FF6B6B', '#1DD1A1', '#FDCB6E', '#9B59B6'];

    this.chartTopPacks = new Chart('chartTopPacks', {
      type: 'bar',
      data: {
        labels: data.map(p => p.nombre),
        datasets: [{
          label: 'Reservas',
          data: data.map(p => p.reservas),
          backgroundColor: colores
        }]
      },
      options: { responsive: true }
    });
  }

  generarGraficoMayorIngreso() {
    if (!this.ingresosPacks.length) return;
    if (this.chartMayorIngreso) this.chartMayorIngreso.destroy();

    const etiquetas = this.ingresosPacks.map(p => p.nombre);
    const datos = this.ingresosPacks.map(p => p.ingresos);

    const colores = this.ingresosPacks.map(p => 
      p.nombre === this.packMayorIngreso.nombre ? '#2C6EFC' : '#FFCE56'
    );

    this.chartMayorIngreso = new Chart('chartMayorIngreso', {
      type: 'doughnut',
      data: {
        labels: etiquetas,
        datasets: [{
          data: datos,
          backgroundColor: colores
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        responsive: true
      }
    });
  }

  exportarPDF() {
    const DATA: any = document.getElementById('contenedor-pdf');
    html2canvas(DATA).then(canvas => {
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = 210;
      const height = canvas.height * width / canvas.width;
      pdf.addImage(img, 'PNG', 0, 0, width, height);
      pdf.save('estadisticas.pdf');
    });
  }
}
