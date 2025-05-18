import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.entity';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private apiUrl = 'https://my-json-server.typicode.com/SoyValzzz/db.clean/users';

  constructor(private router: Router, private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          this.currentUser = user; 
          this.userSubject.next(this.currentUser);
          this.router.navigate(['/home']);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  register(user: User): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${user.email}`).pipe(
      map(users => {
        if (users.length > 0) {
          alert('El usuario ya existe');
          return false;
        } else {
          this.http.post<User>(this.apiUrl, user).subscribe(() => {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            this.router.navigate(['/login']);
          });
          return true;
        }
      })
    );
  }

  logout() {
    this.currentUser = null;
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getRole(): 'admin' | 'empresa' | null {
    return this.currentUser?.role || null;
  }
}
