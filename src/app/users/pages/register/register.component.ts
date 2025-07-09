import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import { User } from '../../model/user.entity';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './register.component.html'
  , styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role: 'PERSON' | 'COMPANY' = 'PERSON';

  registerError: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.registerError = null;
    const newUser: User = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    };

    console.log('[RegisterComponent] Objeto newUser antes de enviar a AuthService:', newUser);
    console.log('[RegisterComponent] Rol seleccionado en el formulario:', newUser.role);

    this.authService.register(newUser).subscribe({
      next: (res) => {
        console.log('Registro exitoso', res);
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.registerError = err.message || 'Error en el registro';
      }
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
