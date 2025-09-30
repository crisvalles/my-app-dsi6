import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`).pipe(
      catchError(this.handleError)
    );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getUsuarioByUsername(username: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios?username=${username}`).pipe(
      catchError(this.handleError)
    );
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    // Asegurar que el usuario se cree como activo y con fecha de creación
    const usuarioConDatosCompletos = {
      ...usuario,
      activo: usuario.activo !== undefined ? usuario.activo : true,
      fechaCreacion: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    };
    
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuarioConDatosCompletos).pipe(
      catchError(this.handleError)
    );
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Método específico para login
  login(username: string, password: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios?username=${username}&password=${password}&activo=true`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para cambiar contraseña
  changePassword(id: number, newPassword: string): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/usuarios/${id}`, { 
      password: newPassword 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para activar/desactivar usuario
  toggleUsuarioStatus(id: number, activo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/usuarios/${id}`, { 
      activo: activo 
    }).pipe(
      catchError(this.handleError)
    );
  }
}