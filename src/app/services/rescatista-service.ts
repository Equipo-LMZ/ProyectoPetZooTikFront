import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RescatistaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.petzootik.site/user/rescuer-request';

  async enviarSolicitud(datos: any, imagenFile: File) {
    const formData = new FormData();
    formData.append('userId', datos.userId);
    formData.append('fecha', datos.fecha);
    formData.append('biografia', datos.biografia);
    formData.append('residencia', datos.residencia);
    formData.append('imagen', imagenFile);

    return await lastValueFrom(this.http.post(this.apiUrl, formData));
  }
}
