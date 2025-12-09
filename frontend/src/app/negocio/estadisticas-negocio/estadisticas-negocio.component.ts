import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasNegocioService } from '../../core/services/stats.service';
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
export class EstadisticasNegocioComponent implements AfterViewInit {

  comercioId = 1;

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

  constructor(private estadisticasService: EstadisticasNegocioService) { }

  ngAfterViewInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.estadisticasService.getTotalReservas(this.comercioId).subscribe(r => this.totalReservas = r);
    this.estadisticasService.getIngresosHoy(this.comercioId).subscribe(r => this.ingresosHoy = r);
    this.estadisticasService.getIngresosTotales(this.comercioId).subscribe(r => this.ingresosTotales = r);
    this.estadisticasService.getPromedioReservasDiarias(this.comercioId).subscribe(r => this.promedioReservas = r);

    this.estadisticasService.getClienteMasPopular(this.comercioId).subscribe(r => this.clientePopular = r);
    this.estadisticasService.getReservaReciente(this.comercioId).subscribe(r => this.reservaReciente = r);

    // Cargar ingresos por pack y generar gráfico comparativo
    this.estadisticasService.getIngresosPorPack(this.comercioId).subscribe(data => {
      this.ingresosPacks = data;
      this.packMayorIngreso = data.reduce((max, actual) =>
        actual.ingresos > max.ingresos ? actual : max
      );
      this.generarGraficoMayorIngreso();
    });

    this.estadisticasService.getTop5Packs(this.comercioId).subscribe(data => {
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

    const colores = this.ingresosPacks.map(p => {
      // Pack con mayor ingreso destacado en azul, otros en colores suaves
      if (p.nombre === this.packMayorIngreso.nombre) return '#2C6EFC';
      const paleta = ['#FF9F43', '#FF6B6B', '#1DD1A1', '#9B59B6', '#FDCB6E'];
      return paleta[Math.floor(Math.random() * paleta.length)];
    });

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
