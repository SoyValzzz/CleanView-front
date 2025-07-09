import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.entity';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authToken: string | null = null;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;


  private backendApiUrl = 'https://backend-web-applications-production-0747.up.railway.app/api/v1/authentication';


  constructor(private router: Router, private http: HttpClient) {

    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');

    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.authToken = storedToken;
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }


  public getAuthToken(): string | null {
    return this.authToken;
  }


  login(email: string, password: string): Observable<boolean> {
    const signInResource = { email: email, password: password };

    // 🔍 Agrega este log para ver qué datos está enviando el frontend al backend
    console.log('[LOGIN] Datos enviados al backend:', signInResource);


    return this.http.post<{ id: number, username: string, email: string, roles: string[], token: string }>(
      `${this.backendApiUrl}/sign-in`,
      signInResource
    ).pipe(
      map(response => {
        const userRole: 'PERSON' | 'COMPANY' = response.roles.length > 0 ? response.roles[0] as 'PERSON' | 'COMPANY' : 'PERSON';

        const loggedInUser: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          role: userRole,
          token: response.token
        };

        console.log('[AuthService] Usuario logueado:', {
          id: loggedInUser.id,
          email: loggedInUser.email,
          role: loggedInUser.role
        });

        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        localStorage.setItem('authToken', loggedInUser.token || '');
        this.authToken = loggedInUser.token || null;
        this.currentUserSubject.next(loggedInUser);

        this.router.navigate(['/home']);
        return true;
      }),
      catchError(this.handleError)
    );
  }





  register(user: User): Observable<any> {
    const roleName = user.role ? user.role.toUpperCase() : 'PERSON';

    const signUpResource = {
      username: user.username,
      email: user.email,
      password: user.password,
      roles: [roleName]
    };

    console.log('[AuthService] signUpResource final que se enviará al backend:', signUpResource);

    return this.http.post<any>(`${this.backendApiUrl}/sign-up`, signUpResource).pipe(
      tap(() => {
        console.log('Registro exitoso en el backend.');
      }),
      catchError(this.handleError)
    );
  }


  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.authToken = null;
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }


  isLoggedIn(): boolean {
    return this.authToken !== null && this.currentUserSubject.value !== null;
  }

  getRole(): 'PERSON' | 'COMPANY' | null {
    return this.currentUserSubject.value?.role || null;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 400 && error.error && error.error.message) {
        errorMessage = `Bad Request: ${error.error.message}`;
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized: Invalid credentials or token expired.';
      } else if (error.status === 409 && error.error && error.error.message) {
        errorMessage = `Conflict: ${error.error.message}`; // Para usuario ya existente
      } else {
        errorMessage = `Server returned code: ${error.status}, error message: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
