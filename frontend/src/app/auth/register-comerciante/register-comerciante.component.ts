import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MapaComponent } from '../../shared/mapa/mapa.component';

@Component({
  selector: 'app-register-comerciante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MapaComponent],
  templateUrl: './register-comerciante.component.html',
  styleUrl: './register-comerciante.component.css'
})
export class RegisterComercianteComponent implements OnInit {
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

    this.form.get('direccion')?.valueChanges.subscribe(() => {
      // Aquí puedes reaccionar a cambios de la dirección si es necesario
    });
  }

  onUbicacionSeleccionada(ubicacion: { lat: number, lng: number, direccion: string }) {
    this.coords = ubicacion;
    this.form.patchValue({ direccion: ubicacion.direccion });
  }

  usarUbicacionActual() {
    if (!navigator.geolocation) {
      alert('La geolocalización no está soportada por tu navegador.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Reverse geocoding con Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => {
            const direccion = data.display_name || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
            this.coords = { lat, lng, direccion };
            this.form.patchValue({ direccion });
          })
          .catch(() => {
            alert('No se pudo obtener la dirección a partir de tu ubicación.');
          });
      },
      (error) => {
        alert('No se pudo obtener la ubicación: ' + error.message);
      }
    );
  }

  registrar() {
    if (this.form.invalid) return;

    const data = {
      ...this.form.value,
      rol: { id: 2 } // Comerciante
    };

    this.authService.register(data).subscribe({
      next: (usuario) => {
        localStorage.setItem('comercianteId', usuario.id.toString());
        this.router.navigate(['/registro-exitoso']);

      },
      error: err => {
        alert('Error al registrar comerciante: ' + (err.error?.mensaje || 'inténtalo de nuevo'));
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
