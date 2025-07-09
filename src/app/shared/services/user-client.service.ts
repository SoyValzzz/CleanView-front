import { Injectable } from '@angular/core';
import { AuthService } from '../../users/services/auth.service'; // Asegúrate de que esta ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class UserClient {
  constructor(private readonly authService: AuthService) {}

  getUserId(): number | null {
    return this.authService.currentUserValue?.id || null;
  }
}

