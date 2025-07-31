import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
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
  tipo: 'cliente' | 'comerciante' = 'cliente';
  coords: { lat: number, lng: number, direccion: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const tipoParam = this.route.snapshot.paramMap.get('tipo');
    if (tipoParam === 'cliente' || tipoParam === 'comerciante') {
      this.tipo = tipoParam;
    }

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      ...(this.tipo === 'comerciante' && {
        nombreNegocio: ['', Validators.required]
      })
    });


    // Si comerciante, escuchar cambios en campo direccion
    if (this.tipo === 'comerciante') {
      this.form.get('direccion')?.valueChanges.subscribe(direccion => {
        // Se propaga al mapa automáticamente por [direccion]
      });
    }
  }

  onUbicacionSeleccionada(ubicacion: { lat: number, lng: number, direccion: string }) {
    this.coords = ubicacion;
    this.form.patchValue({ direccion: ubicacion.direccion });
  }

  registrar() {
    if (this.form.invalid) return;

    const rolId = this.tipo === 'cliente' ? 1 : 2;

    const data = {
      ...this.form.value,
      rol: { id: rolId },
      ...(this.tipo === 'comerciante' && this.coords && {
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

}
