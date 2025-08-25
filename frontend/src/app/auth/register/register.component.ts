import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MapaComponent } from '../../shared/mapa/mapa.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MapaComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  coords: { lat: number, lng: number, direccion: string } | null = null;
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

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

        // Reverse geocoding con Nominatim
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

  registrar() {
    if (this.form.invalid) return;

    const data = {
      ...this.form.value,
      rol: { id: 1 }, // Cliente
      ...(this.coords && {
        latitud: this.coords.lat,
        longitud: this.coords.lng
      })
    };

    this.authService.register(data).subscribe({
      next: () => {
        alert('¡Registro exitoso!');
        this.router.navigate(['/login']);
      },
      error: err => {
        alert('Error al registrar: ' + (err.error?.mensaje || 'inténtalo de nuevo'));
      }
    });
  }

  volver() {
    this.router.navigate(['/register']);
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
