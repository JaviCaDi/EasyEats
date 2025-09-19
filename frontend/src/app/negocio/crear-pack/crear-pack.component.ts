import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../core/services/auth.service';
import { PackService } from '../../core/services/pack.service';

@Component({
  selector: 'app-crear-pack',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-pack.component.html',
  styleUrls: ['./crear-pack.component.css']
})
export class CrearPackComponent implements OnInit {
  packForm!: FormGroup;
  negocioId: number | null = null;
  imagenFile?: File;
  imagenPreview: string | ArrayBuffer | null = null; // 👈 vista previa

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private packService: PackService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    console.log("Usuario ID desde token:", userId);

    if (userId) {
      this.authService.getUsuario(userId).subscribe({
        next: (usuario: Usuario) => {
          console.log("Usuario cargado:", usuario);
          this.negocioId = usuario.negocio ? usuario.negocio.id : null;
          console.log("Negocio asignado:", this.negocioId);
        },
        error: (err) => {
          console.error('Error al cargar usuario', err);
        }
      });
    }

    this.packForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0.1)]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  // 🔥 Actualizado para generar vista previa
  onFileSelected(event: any): void {
    this.imagenFile = event.target.files[0];

    if (this.imagenFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(this.imagenFile);
    } else {
      this.imagenPreview = null;
    }
  }

  crearPack(): void {
    if (!this.packForm.valid || !this.negocioId) {
      alert('Faltan datos o no tienes un negocio asignado.');
      return;
    }

    const formData = new FormData();
    formData.append('negocioId', this.negocioId.toString());
    formData.append('titulo', this.packForm.value.titulo);
    formData.append('descripcion', this.packForm.value.descripcion);
    formData.append('precio', this.packForm.value.precio);
    formData.append('cantidad', this.packForm.value.cantidad);

    if (this.imagenFile) {
      formData.append('imagen', this.imagenFile);
    }

    this.packService.crearPack(formData).subscribe({
      next: () => {
        alert('Pack creado con éxito');
        this.router.navigate(['/negocio/mis-packs']);
      },
      error: (err) => {
        console.error('Error al crear pack:', err);
        alert('No se pudo crear el pack');
      }
    });
  }
}
