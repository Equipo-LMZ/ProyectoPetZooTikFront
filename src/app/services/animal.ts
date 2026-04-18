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
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private mapearMascota = (datoBackend: any): Animal => {
    return {
      id: datoBackend.idMascota,
      idRescatista: datoBackend.idRescatista,
      nombre: datoBackend.nombre,
      descripcion: datoBackend.descripcion,
      tipo: datoBackend.tipoAnimal,
      lugar: datoBackend.lugarRescate,
      ubicacion: datoBackend.ubicacionActual,
      imagen: datoBackend.imagen ? `${this.baseUrl}${datoBackend.imagen}` : null,
    };
  };

  // Fetch (Ya se que no se llaman fetch) publicas
  async obtenerAnimales() {
    try {
      const res: any = await lastValueFrom(this.http.get(`${this.baseUrl}/pets`));

      const dataCruda = Array.isArray(res) ? res : res.datos || res.pets || [];

      const animalesMapeados = dataCruda.map(this.mapearMascota);

      this.listaAnimales.set(animalesMapeados);

      return animalesMapeados;
    } catch (error) {
      console.error('Error al obtener los animales:', error);
      return [];
    }
  }

  async obtenerPorId(id: number) {
    try {
      const res: any = await lastValueFrom(this.http.get(`${this.baseUrl}/pets/${id}`));
      return this.mapearMascota(res);
    } catch (error) {
      console.error('Error al obtener el animal:', error);
      throw error;
    }
  }

  async obtenerSolicitudesRecibidas() {
    try {
      const res: any = await lastValueFrom(
        this.http.get(`${this.baseUrl}/solicitud`, { 
          headers: this.getHeaders() 
        })
      );

      return Array.isArray(res) ? res : (res.datos || res.solicitudes || []);
    } catch (error) {
      console.error('Error al obtener solicitudes recibidas:', error);
      return [];
    }
  }

  async enviarSolicitudAdopcion(payload: any) {
    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/solicitud`, payload, { headers: this.getHeaders() }),
      );
    } catch (error) {
      console.error('Error al enviar solicitud de adopción:', error);
      throw error;
    }
  }

  // Fetch (Ya se que no se llaman fetch) privadas
  // Get Animales Rescatista
  async obtenerMisMascotas(idRescatista: number) {
    try {
      // Usamos la ruta del back
      const res: any = await lastValueFrom(
        this.http.get(`${this.baseUrl}/pets?idRescuer=${idRescatista}`, {
          headers: this.getHeaders(),
        }),
      );

      const dataCruda = Array.isArray(res) ? res : res.datos || res.pets || [];
      const animalesMapeados = dataCruda.map(this.mapearMascota);

      this.listaAnimales.set(animalesMapeados);
      return animalesMapeados;
    } catch (error) {
      console.error('Error al obtener mis mascotas:', error);
      return [];
    }
  }

  // CREATE
  async crearAnimal(formData: FormData) {
    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/pets`, formData, { headers: this.getHeaders() }),
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
        this.http.put(`${this.baseUrl}/pets/${id}`, formData, { headers: this.getHeaders() }),
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
        this.http.delete(`${this.baseUrl}/pets/${id}`, { headers: this.getHeaders() }),
      );
    } catch (error) {
      console.error('Error al eliminar animal:', error);
      throw error;
    }
  }
}
