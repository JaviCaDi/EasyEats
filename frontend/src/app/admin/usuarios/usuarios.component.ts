import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Usuario } from '../../core/services/admin.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuariosUser: Usuario[] = [];
  usuariosBusiness: Usuario[] = [];
  cargando = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.adminService.getUsuarios().subscribe({
      next: (data) => {
        // Filtrar para excluir admins
        const sinAdmin = data.filter(u => u.rol.nombre !== 'ADMIN');

        // Separar por rol
        this.usuariosUser = sinAdmin.filter(u => u.rol.nombre === 'USER');
        this.usuariosBusiness = sinAdmin.filter(u => u.rol.nombre === 'BUSINESS');

        this.usuarios = sinAdmin; // opcional, si quieres un listado general
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.cargando = false;
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      this.adminService.eliminarUsuario(id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }
}
