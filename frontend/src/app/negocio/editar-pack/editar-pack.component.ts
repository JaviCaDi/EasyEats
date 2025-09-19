import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PackService } from '../../core/services/pack.service';

@Component({
  selector: 'app-editar-pack',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-pack.component.html',
  styleUrls: ['./editar-pack.component.css']
})
export class EditarPackComponent implements OnInit {
  packForm!: FormGroup;
  packId!: number;
  imagenPreview: string | null = null;
  imagenFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private packService: PackService
  ) { }

  ngOnInit(): void {
    this.packId = Number(this.route.snapshot.paramMap.get('id'));

    // Inicializar formulario
    this.packForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });

    // Cargar pack actual
    this.packService.getPackById(this.packId).subscribe({
      next: (pack) => {
        this.packForm.patchValue({
          titulo: pack.titulo,
          descripcion: pack.descripcion,
          precio: pack.precio,
          cantidad: pack.cantidad
        });
        this.imagenPreview = pack.imagenUrl ? `http://localhost:8080${pack.imagenUrl}` : null;
      },
      error: (err) => console.error('Error cargando pack', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenFile = file;

      // Vista previa
      const reader = new FileReader();
      reader.onload = e => this.imagenPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  guardar(): void {
    if (this.packForm.invalid) return;

    const formData = new FormData();
    formData.append('titulo', this.packForm.get('titulo')?.value);
    formData.append('descripcion', this.packForm.get('descripcion')?.value);
    formData.append('precio', this.packForm.get('precio')?.value);
    formData.append('cantidad', this.packForm.get('cantidad')?.value);
    if (this.imagenFile) {
      formData.append('imagen', this.imagenFile);
    }

    this.packService.actualizarPack(this.packId, formData).subscribe({
      next: () => {
        alert('Pack actualizado con éxito');
        this.router.navigate(['/negocio/mis-packs']);
      },
      error: (err) => console.error('Error al actualizar pack', err)
    });
  }
  volver(): void {
    this.router.navigate(['/negocio/mis-packs']);
  }

}
