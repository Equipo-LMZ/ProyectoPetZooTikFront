import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RescatistaService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.petzootik.site/user';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  async enviarSolicitud(datos: any, imagenFile: File) {
    const formData = new FormData();
    formData.append('userId', localStorage.getItem('userId') || '');
    formData.append('fecha', datos.fecha);
    formData.append('biografia', datos.biografia);
    formData.append('residencia', datos.residencia);
    formData.append('imagen', imagenFile);

    return await lastValueFrom(this.http.post(`${this.baseUrl}/rescuer-request`, formData, { headers: this.getHeaders() }));
  }

  // Obtener todas las peticiones de rescatistas
  async obtenerPeticiones(status: string) {
    try {
      return await lastValueFrom(
        this.http.get<any>(`${this.baseUrl}/rescuer-request?status=${status}`, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error('Error obteniendo peticiones:', error);
      throw error;
    }
  }

  // Metodo para aprobar o rechazar la solicitud de ser rescatista.
  async responderPeticion(id: number, aprobado: boolean) {
    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/rescuers/${id}/aprove`, { aprobado }, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error(`Error al responder petición ${id}:`, error);
      throw error;
    }
  }
}
