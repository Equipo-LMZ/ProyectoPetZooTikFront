import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.petzootik.site/user';

  public currentUser = signal<any>(null);

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser.set({ token });
    }
  }

  // Login
  async login(credenciales: { correo: string; contrasena: string }) {
    try {
      const res = await lastValueFrom(
        this.http.post<{ token: string; user: any }>(`${this.baseUrl}/login`, credenciales)
      );
      
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res);
      }
      return res;
    } catch (error) {
      console.error('Error en AuthService.login:', error);
      throw error;
    }
  }

  // Registro
  async registro(usuario: { nombre: string; correo: string; contrasena: string }) {
    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/register`, usuario)
      );
    } catch (error) {
      console.error('Error en AuthService.registro:', error);
      throw error;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
}