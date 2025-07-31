import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-elegir-registro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './elegir-registro.component.html',
  styleUrl: './elegir-registro.component.css'
})
export class ElegirRegistroComponent {
  constructor(private router: Router) {}

  elegir(tipo: 'cliente' | 'comerciante') {
    this.router.navigate(['/register', tipo]);
  }
}
