import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'https://api.petzootik.site/chat'; 
  private socketUrl = 'https://api.petzootik.site';
  
  private socket: Socket;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() {
    // Inicializamos el "tubo" principal de comunicación
    this.socket = io(this.socketUrl);
  }

  // Obtenemos el token del localStorage usando el AuthService
  private getHeaders() {
    const token = this.authService.currentUser()?.token;
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // 1. CONEXIÓN GLOBAL (Para notificaciones)
  
  // Llama a esto justo después de que el usuario haga Login exitoso
  conectarUsuarioGlobal(miId: number): void {
    this.socket.emit('conectar_usuario', miId);
  }

  // 2. PETICIONES HTTP (REST - La carga pesada)

  obtenerMisChats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chats`, { headers: this.getHeaders() });
  }

  obtenerMensajes(chatId: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/mensajes/${chatId}`, { headers: this.getHeaders() });
  }

  iniciarChat(idRescatista: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar`, { idRescatista }, { headers: this.getHeaders() });
  }

  enviarMensaje(chatId: string | number, mensaje: string, imagen?: File): Observable<any> {
    const formData = new FormData();
    formData.append('chat_id', chatId.toString());
    formData.append('mensaje', mensaje);
    
    if (imagen) {
      formData.append('imagen', imagen);
    }
    // Recordatorio: Angular calcula el Content-Type automáticamente por el FormData
    return this.http.post(`${this.apiUrl}/`, formData, { headers: this.getHeaders() });
  }

  // 3. HABLAR POR SOCKETS (Acciones rápidas)

  unirseSala(chatId: string | number): void {
    this.socket.emit('unirse_chat', chatId);
  }

  abandonarSala(chatId: string | number): void {
    this.socket.emit('salir_chat', chatId);
  }

  marcarComoLeido(chatId: string | number, miId: number, idDelOtro: number): void {
    this.socket.emit('marcar_leido', {
      chat_id: chatId,
      mi_id: miId,
      id_del_otro: idDelOtro
    });
  }

  // 4. ESCUCHAR POR SOCKETS (Magia Reactiva)

  // Escucha cuando tú o la otra persona mandan un mensaje a una sala abierta
  escucharNuevosMensajes(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('nuevo_mensaje', (mensaje) => {
        observer.next(mensaje);
      });
    });
  }

  // Escucha cuando alguien te manda mensaje pero NO tienes su chat abierto (Puntito rojo)
  escucharNotificacionesGlobales(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('notificacion_chat', (datos) => {
        observer.next(datos);
      });
    });
  }

  // Escucha cuando la otra persona abre tu chat (Palomitas azules)
  escucharMensajesVistos(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('mensajes_vistos', (datos) => {
        observer.next(datos);
      });
    });
  }
  
  // Desconecta el socket (cuando el usuario cierre sesión)
  desconectarSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Reconecta el socket (Si por alguna razón se necesita forzar reconexión)
  reconectarSocket(): void {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }
}
