import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, TranslateModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loginError = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        if (!success) {
          this.loginError = 'Email or password incorrect.';
        }
      },
      error: (err) => {
        this.loginError = err.message || 'Login failed. Please try again.';
      }
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
