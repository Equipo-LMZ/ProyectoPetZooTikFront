import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.petzootik.site/user';

  public currentUser = signal<{ id: number; nombre: string; token: string } | null>(null);

  constructor() {
    this.recuperarSesion();
  }

  private recuperarSesion() {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');
    const idStr = localStorage.getItem('userId');

    if (token && nombre && idStr) {
      this.currentUser.set({ 
        token, 
        nombre, 
        id: Number(idStr)
      });
    }
  }

  async login(credenciales: { correo: string; contrasena: string }) {
    try {
      const res = await lastValueFrom(
        this.http.post<any>(`${this.baseUrl}/login`, credenciales)
      );
      
      if (res && res.token) {
        this.establecerSesion(res);
      }
      return res;
    } catch (error) {
      console.error('Error en AuthService.login:', error);
      throw error;
    }
  }

  async registro(usuario: { nombre: string; correo: string; contrasena: string }) {
    try {
      const res = await lastValueFrom(
        this.http.post<any>(`${this.baseUrl}/register`, usuario)
      );
      
      if (res && res.token) {
        this.establecerSesion(res);
      }
      return res;
    } catch (error) {
      console.error('Error en AuthService.registro:', error);
      throw error;
    }
  }

  private establecerSesion(res: any) {
    const token = res.token;
    const nombre = res.nombre || res.user?.nombre || 'Usuario';
    const id = Number(res.id || res.user?.id || res._id);

    localStorage.setItem('token', token);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('userId', id.toString());

    this.currentUser.set({ id, nombre, token });
  }

  logout() {
    localStorage.clear();
    this.currentUser.set(null);
  }
}