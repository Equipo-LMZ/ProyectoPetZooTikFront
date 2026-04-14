import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Animal } from '../interfaces/animal';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'https://api.petzootik.site';

  public listaAnimales = signal<Animal[]>([]);

  // Función para obtener el token en las peticiones CRUD es para facilitar la logica
  private getHeaders() {
    const token = this.authService.currentUser()?.token;
    return new HttpHeaders({Authorization: `Bearer ${token}`})
  }

  // Fetch (Ya se que no se llaman fetch) publicas
  async obtenerAnimales() {
    try {
      const data = await lastValueFrom(
        this.http.get<Animal[]>(`${this.baseUrl}/pets`),
      );
      this.listaAnimales.set(data);
      return data;
    } catch (error) {
      console.error('Error al obtener los animales:', error);
      throw error;
    }
  }

  async obtenerPorId(id: number) {
    try {
        const data = await lastValueFrom(this.http.get<Animal>(`${this.baseUrl}/pets/${id}`),
      );
      return data;
    } catch (error) {
      console.error('Error al obtener el animal:', error);
      throw error;
    }
  }

  // Fetch (Ya se que no se llaman fetch) privadas
  // CREATE
  async crearAnimal(formData: FormData) {
    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/pets`, formData, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error('Error al crear animal:', error);
      throw error;
    }
  }

  // UPDATE
  async actualizarAnimal(id: number, formData: FormData) {
    try {
      return await lastValueFrom(
        this.http.put(`${this.baseUrl}/pets/${id}`, formData, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error('Error al actualizar animal:', error);
      throw error;
    }
  }

  // DELETE
  async eliminarAnimal(id: number) {
    try {
      return await lastValueFrom(
        this.http.delete(`${this.baseUrl}/pets/${id}`, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error('Error al eliminar animal:', error);
      throw error;
    }
  }
}
