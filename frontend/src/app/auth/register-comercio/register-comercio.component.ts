import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ImageCropperComponent } from '../../shared/image-cropper/image-cropper.component';
import { MapaComponent } from '../../shared/mapa/mapa.component'; // ⬅️ mapa

@Component({
  selector: 'app-register-comercio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageCropperComponent, MapaComponent],
  templateUrl: './register-comercio.component.html',
  styleUrls: ['./register-comercio.component.css']
})
export class RegisterComercioComponent implements OnInit {
  form!: FormGroup;

  // 📍 Estado para mapa/coords
  coords: { lat: number, lng: number, direccion: string } | null = null;

  // 🖼️ Estado para imagen y cropper
  imagenPreview: string | null = null;
  imagenArchivo: File | null = null;
  mostrarCropper = false;
  imagenParaCropper: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      horario: [''],
      descripcion: ['']
    });
  }

  // =========================
  // 🗺️ Mapa y geolocalización
  // =========================
  onUbicacionSeleccionada(ubicacion: { lat: number, lng: number, direccion: string }) {
    this.coords = ubicacion;
    this.form.patchValue({ direccion: ubicacion.direccion });
  }

  usarMiUbicacion() {
    if (!navigator.geolocation) {
      alert('La geolocalización no está soportada en tu navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Reverse geocoding con Nominatim (sin API key)
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => {
            const direccion = data.display_name || '';
            this.coords = { lat, lng, direccion };
            this.form.patchValue({ direccion });
          })
          .catch(() => {
            alert('No se pudo obtener la dirección a partir de tu ubicación.');
          });
      },
      error => {
        alert('No se pudo acceder a tu ubicación: ' + error.message);
      }
    );
  }

  // =========================
  // 🖼️ Imagen / Cropper
  // =========================
  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.imagenArchivo = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenParaCropper = reader.result as string;
      this.mostrarCropper = true;
    };
    reader.readAsDataURL(file);
  }

  onImagenRecortada(base64: string) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);

    this.imagenArchivo = new File([u8arr], 'imagen.png', { type: mime });
    this.imagenPreview = base64;
    this.mostrarCropper = false;
  }

  cancelarCropper() {
    this.mostrarCropper = false;
  }

  // =========================
  // ✅ Registro
  // =========================
  // =========================
  // ✅ Registro
  // =========================
  registrarComercio() {
    if (this.form.invalid) return;

    const usuarioIdStr = localStorage.getItem('comercianteId');
    if (!usuarioIdStr) {
      alert('No se encontró usuario registrado. Por favor, regístrate primero.');
      this.router.navigate(['/register-comerciante']);
      return;
    }

    const usuario_id = Number(usuarioIdStr);
    if (isNaN(usuario_id)) {
      alert('ID de usuario inválido.');
      this.router.navigate(['/register-comerciante']);
      return;
    }

    // Construimos el JSON de negocio incluyendo lat/lng si existen
    const negocioPayload: any = {
      ...this.form.value,
      ...(this.coords && {
        latitud: this.coords.lat,
        longitud: this.coords.lng
      })
    };

    const formData = new FormData();
    formData.append('negocio', new Blob([JSON.stringify(negocioPayload)], { type: 'application/json' }));

    if (this.imagenArchivo) {
      formData.append('imagen', this.imagenArchivo);
    }

    // 1️⃣ Crear negocio
    this.authService.crearNegocio(formData).subscribe({
      next: (negocio: any) => {
        // 2️⃣ Vincular negocio al usuario usando asignarNegocio
        this.authService.asignarNegocio(usuario_id, negocio.id).subscribe({
          next: () => {
            alert('Comercio registrado y vinculado al usuario con éxito');
            this.router.navigate(['/']);
          },
          error: err => {
            alert('El negocio se creó, pero no se pudo vincular al usuario: ' + (err.error?.mensaje || 'inténtalo de nuevo'));
          }
        });
      },
      error: err => {
        alert('Error al registrar comercio: ' + (err.error?.mensaje || 'inténtalo de nuevo'));
      }
    });
  }

  cancelar() {
    this.router.navigate(['/register-comerciante']);
  }
}
