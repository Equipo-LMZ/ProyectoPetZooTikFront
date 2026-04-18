import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatThread, Mensaje } from '../../interfaces/chat';
import { SmartphoneChatComponent } from '../../components/smartphone-chat/smartphone-chat';
import { ChatService } from '../../services/chat-service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, SmartphoneChatComponent],
  standalone: true,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  chatActivo: ChatThread | null = null;
  filtroBusqueda = '';

  conversaciones: ChatThread[] = [];

  private cdr = inject(ChangeDetectorRef);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.obtenerMisChats().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.conversaciones = response.data.map((chatInfo: any) => {
            // Generamos las iniciales para el avatar usando el nombre que trae el backend
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(chatInfo.nombreCandidato || 'Usuario')}&background=random`;
            
            return {
              id: chatInfo.id || chatInfo.idChat,
              nombreCandidato: chatInfo.nombreCandidato || 'Usuario Desconocido',
              animalId: 0, 
              animalNombre: '', // En un futuro, el nombre del animal se encontrará en el id del chat
              avatar: avatarUrl,
              mensajes: [] 
            } as ChatThread;
          });
          this.cdr.detectChanges(); // Forzamos a Angular a actualizar la interfaz
        }
      },
      error: (err) => {
        console.error('Error al obtener los chats:', err);
      }
    });
  }

  get conversacionesFiltradas() {
    if (!this.conversaciones) return [];
    return this.conversaciones.filter(c => {
      const nombre = c.nombreCandidato || '';
      const animal = c.animalNombre || '';
      const filtro = this.filtroBusqueda || '';
      return nombre.toLowerCase().includes(filtro.toLowerCase()) || 
             animal.toLowerCase().includes(filtro.toLowerCase());
    });
  }

  abrirChat(chat: ChatThread) {
    this.chatActivo = chat;
  }

  cerrarChat() {
    this.chatActivo = null;
  }

  actualizarFiltro(event: any) {
    this.filtroBusqueda = event.target.value;
  }
}
