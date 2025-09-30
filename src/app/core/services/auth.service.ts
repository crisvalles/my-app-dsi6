import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.loadCurrentUser();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      this.usuarioService.login(username, password).subscribe({
        next: (usuarios) => {
          if (usuarios && usuarios.length > 0) {
            const user = usuarios[0];
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', 'fake-jwt-token');
            this.loggedIn.next(true);
            this.currentUserSubject.next(user);
            observer.next(true);
          } else {
            observer.next(false);
          }
          observer.complete();
        },
        error: (error) => {
          console.error('Error en login:', error);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private loadCurrentUser(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.loggedIn.next(true);
    }
  }

  getCurrentUserValue(): any {
    return this.currentUserSubject.value;
  }
}