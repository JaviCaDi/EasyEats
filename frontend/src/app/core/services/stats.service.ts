import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasNegocioService {

  constructor() { }

  getTotalReservas(id: number): Observable<number> {
    return of(128).pipe(delay(300)); // valor simulado
  }

  getIngresosHoy(id: number): Observable<number> {
    return of(240).pipe(delay(300)); // euros de hoy
  }

  getIngresosTotales(id: number): Observable<number> {
    return of(8540).pipe(delay(300));
  }

  getTop5Packs(id: number): Observable<any[]> {
    return of([
      { nombre: 'Pack Familiar', reservas: 34 },
      { nombre: 'Pack Desayuno', reservas: 28 },
      { nombre: 'Pack Cena Romántica', reservas: 22 },
      { nombre: 'Pack Vegano', reservas: 17 },
      { nombre: 'Pack Infantil', reservas: 14 }
    ]).pipe(delay(300));
  }

  getPromedioReservasDiarias(id: number): Observable<number> {
    return of(8.7).pipe(delay(300));
  }

  getClienteMasPopular(id: number): Observable<any> {
    return of({
      nombre: 'Carlos Fernández',
      reservas: 12
    }).pipe(delay(300));
  }

  getReservaReciente(id: number): Observable<any> {
    return of({
      fecha: '2025-02-12 18:30',
      cliente: 'Lucía García',
      pack: 'Pack Cena Romántica'
    }).pipe(delay(300));
  }

  getPackMayorIngreso(id: number): Observable<any> {
    return of({
      nombre: 'Pack Familiar',
      ingresos: 2300
    }).pipe(delay(300));
  }

  getIngresosPorPack(id: number): Observable<any[]> {
    const fake = [
      { nombre: 'Pack A', ingresos: 120 },
      { nombre: 'Pack B', ingresos: 350 },
      { nombre: 'Pack C', ingresos: 90 },
      { nombre: 'Pack D', ingresos: 190 },
      { nombre: 'Pack E', ingresos: 260 }
    ];
    return of(fake);
  }

}
