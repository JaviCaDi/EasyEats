import {
  Component,
  EventEmitter,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Output() coordenadasSeleccionadas = new EventEmitter<{
    lat: number;
    lng: number;
    direccion: string;
  }>();

  private map!: L.Map;
  private marker!: L.Marker;

  private _direccion: string = '';

  @Input()
  set direccion(valor: string) {
    if (valor && valor !== this._direccion) {
      this._direccion = valor;
      this.buscarCoordenadas(valor);
    }
  }

  get direccion(): string {
    return this._direccion;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([40.4168, -3.7038], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    this.marcarUbicacion([lat, lng]);

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        const direccion = data.display_name || 'Dirección no encontrada';
        this.coordenadasSeleccionadas.emit({ lat, lng, direccion });
      });
  }

  private buscarCoordenadas(direccion: string): void {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          this.marcarUbicacion([lat, lng]);
          this.map.setView([lat, lng], 17);
        }
      });
  }

  private marcarUbicacion([lat, lng]: [number, number]): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }
}
