import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

interface UsuarioTest {
  idUsuario: number;
  nombreUsuario: string;
}

@Component({
  selector: 'app-mapa',
  imports: [],
  standalone: true,
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa {
  private http = inject(HttpClient);

  // --- CONFIGURA AQUÍ TU BACKEND ---
  private IP = '72.60.24.196';
  private PUERTO = '3000';
  private URL = `http://${this.IP}:${this.PUERTO}/perfil`; // Cambia '/user/test' por tu ruta real

  // Variable para guardar la respuesta
  datosRecibidos: UsuarioTest | null = null;
  errorStatus: string | null = null;

  async testearBackend() {
    this.datosRecibidos = null;
    this.errorStatus = null;

    try {
      console.log('Iniciando petición GET a:', this.URL);

      // Realizamos el GET esperando el objeto { idUsuario, nombreUsuario }
      const respuesta = await lastValueFrom(this.http.get<UsuarioTest>(this.URL));

      this.datosRecibidos = respuesta;
      console.log('Respuesta exitosa:', this.datosRecibidos);
    } catch (error: any) {
      console.error('Error en la conexión:', error);
      this.errorStatus = `Error ${error.status}: ${error.message}`;
    }
  }
}
