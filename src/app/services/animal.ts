import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Animal } from '../interfaces/animal';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.petzootik.site';

  public listaAnimales = signal<Animal[]>([]);

  // Obtiene un token fresco haciendo login
  // esto hay q eliminarlo, es sólo de prueba
  private async getToken(): Promise<string> {
    const res = await lastValueFrom(
      this.http.post<{ token: string }>(`${this.baseUrl}/user/login`, {
        correo: 'JulianJoto@correo.com',
        contrasena: 'julianJoto123',
      }),
    );
    return res.token;
  }

  async obtenerAnimales() {
    try {
      const token = await this.getToken();
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      const data = await lastValueFrom(
        this.http.get<Animal[]>(`${this.baseUrl}/pets`, { headers }),
      );
      this.listaAnimales.set(data);
    } catch (error) {
      console.error('Error al conectar con la lista de animales:', error);
      throw error;
    }
  }

  async obtenerPorId(id: number) {
    const token = await this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return await lastValueFrom(this.http.get<Animal>(`${this.baseUrl}/pets/${id}`, { headers }));
  }
}
