import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnChanges, AfterViewInit {
  @Input() imagenBase64: string | null = null;
  @Output() recortar = new EventEmitter<string>();
  @Output() cancelar = new EventEmitter<void>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D | null;
  private img = new Image();
  private cropSize = 250; // tamaño del círculo de recorte (px)
  private canvasSize = 300; // tamaño canvas (px)

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    if (this.imagenBase64) {
      this.cargarImagen();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imagenBase64'] && this.imagenBase64 && this.ctx) {
      this.cargarImagen();
    }
  }

  private cargarImagen() {
    this.img = new Image();
    this.img.onload = () => {
      this.dibujarCanvas();
    };
    this.img.src = this.imagenBase64!;
  }

  private dibujarCanvas() {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // dibujar imagen escalada centrada
    // escalamos para que el menor lado ocupe cropSize
    const scale = this.cropSize / Math.min(this.img.width, this.img.height);
    const iw = this.img.width * scale;
    const ih = this.img.height * scale;
    const ix = (canvas.width - iw) / 2;
    const iy = (canvas.height - ih) / 2;

    this.ctx.drawImage(this.img, ix, iy, iw, ih);

    // máscara circular para recorte (máscara oscura fuera)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.beginPath();
    this.ctx.rect(0, 0, canvas.width, canvas.height);
    this.ctx.arc(canvas.width / 2, canvas.height / 2, this.cropSize / 2, 0, Math.PI * 2, true);
    this.ctx.fill('evenodd');

    // círculo visible para recorte
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(canvas.width / 2, canvas.height / 2, this.cropSize / 2, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  hacerRecorte() {
    if (!this.ctx) return;

    const canvas = document.createElement('canvas');
    const size = this.cropSize;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // calculamos la porción de imagen a recortar
    // el área circular está centrada en el canvas principal
    const sx = (this.img.width / (this.canvasSize / size)) / 2 - size / 2;
    const sy = (this.img.height / (this.canvasSize / size)) / 2 - size / 2;

    // Para evitar complicaciones: redibujamos la imagen escalada dentro del canvas nuevo y recortamos con clip circular

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // dibujar la imagen escalada centrada y recortada
    // recalculamos escala usada antes
    const scale = this.cropSize / Math.min(this.img.width, this.img.height);
    const iw = this.img.width * scale;
    const ih = this.img.height * scale;

    // la imagen debe quedar centrada en el canvas nuevo
    // offset para dibujar la imagen en canvas nuevo
    const dx = (size - iw) / 2;
    const dy = (size - ih) / 2;

    ctx.drawImage(this.img, dx, dy, iw, ih);

    ctx.restore();

    // emitir imagen en base64 PNG
    const base64recortada = canvas.toDataURL('image/png');
    this.recortar.emit(base64recortada);
  }

  cancelarRecorte() {
    this.cancelar.emit();
  }
}
