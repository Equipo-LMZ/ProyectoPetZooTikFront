import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AlertsService } from './alerts-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private alertsService = inject(AlertsService);
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
      credenciales.correo = credenciales.correo.toLowerCase();
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
      usuario.correo = usuario.correo.toLowerCase();
      
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

    const idCrudo = res.userId ?? res.datos?.id ?? res.id;
    const id = Number(idCrudo);

    const nombre = res.datos?.nombre ?? res.nombre ?? 'Nuevo adoptante';

    if (token && idCrudo !== undefined && !isNaN(id)) {
      localStorage.setItem('token', token);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('userId', id.toString());

      this.currentUser.set({ id, nombre, token });

      console.log('Sesión establecida a prueba de balas:', { id, nombre });
    } else {
      console.error('Error de mapeo: No se encontró res.token o el ID', res);
    }
  }

  logout() {
    localStorage.clear();
    this.currentUser.set(null);
    this.alertsService.success('Sesión finalizada', 'Tu sesión se ha cerrado exitosamente.');
    this.router.navigate(['/'])
  }
}