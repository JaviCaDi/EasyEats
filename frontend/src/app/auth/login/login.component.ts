import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) return;

    const { email, contraseña } = this.form.value;

    this.authService.login(email, contraseña).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/']);
      },
      error: err => {
        this.error = err.error?.mensaje || 'Credenciales incorrectas';
      }
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
