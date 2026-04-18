import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth';
import { ChatService } from '../../services/chat-service';
import { AnimalService } from '../../services/animal';
import { ChatThread, Mensaje } from '../../interfaces/chat';
import { SmartphoneChatComponent } from '../smartphone-chat/smartphone-chat';

@Component({
  selector: 'app-floating-chat',
  standalone: true,
  imports: [CommonModule, SmartphoneChatComponent],
  templateUrl: './floating-chat.html'
})
export class FloatingChatComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  public authService = inject(AuthService);
  private chatService = inject(ChatService);
  private animalService = inject(AnimalService);
  private cdr = inject(ChangeDetectorRef);

  isInPanel = false;
  isOpen = false;
  hasUnread = false;

  conversaciones: ChatThread[] = [];
  chatActivo: ChatThread | null = null;
  
  private routerSub!: Subscription;
  private messageSub!: Subscription;
  private loaded = false;

  ngOnInit() {
    console.log('FloatingChatComponent INICIADO');
    this.checkRoute(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.messageSub) this.messageSub.unsubscribe();
  }

  private checkRoute(url: string) {
    this.isInPanel = url.includes('/panel');
    if (this.isInPanel) {
       this.isOpen = false;
       this.chatActivo = null;
    } else if (this.authService.currentUser() !== null && !this.loaded) {
       this.cargarChats();
       this.listenMessages();
       this.loaded = true;
    }
  }

  get isVisible() {
    const isVis = !this.isInPanel && this.authService.currentUser() !== null;
    return isVis;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.conversaciones.length === 0 && !this.loaded) {
      this.cargarChats();
    }
    if (this.isOpen) {
      this.hasUnread = false;
    }
  }

  cargarChats() {
    this.chatService.obtenerMisChats().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.conversaciones = response.data.map((chatInfo: any) => {
            const avatarUrl = chatInfo.avatar 
              ? (chatInfo.avatar.startsWith('http') ? chatInfo.avatar : `https://api.petzootik.site${chatInfo.avatar}`)
              : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

            return {
              id: chatInfo.id || chatInfo.idChat,
              nombreCandidato: chatInfo.nombreCandidato || 'Usuario Desconocido',
              idAdoptante: chatInfo.idAdoptante,
              idRescatista: chatInfo.idRescatista,
              animalId: 0, 
              animalNombre: '', 
              avatar: avatarUrl,
              mensajes: [],
              formularios: []
            } as ChatThread;
          });

          this.conversaciones.forEach(chat => {
            this.chatService.unirseSala(chat.id);
          });

          this.cargarFormularios();
          this.cdr.detectChanges();
        }
      }
    });
  }

  async cargarFormularios() {
    try {
      const response = await this.animalService.obtenerSolicitudesRecibidas();
      if (response && response.solicitudes) {
        const solicitudes = response.solicitudes;
        
        this.conversaciones.forEach(chat => {
          if (chat.idAdoptante && chat.idRescatista) {
            chat.formularios = solicitudes
              .filter((sol: any) => sol.idUser == chat.idAdoptante && sol.idRescatista == chat.idRescatista)
              .map((sol: any) => {
                let rawData = sol.formulario;
                if (typeof rawData === 'string') {
                  try {
                    rawData = JSON.parse(rawData);
                  } catch (e) {
                    console.error('Error parseando formulario', e);
                    return sol;
                  }
                }

                if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
                  const formattedFields = [];
                  if (rawData.nombreCompleto) formattedFields.push({ label: 'Nombre Completo', value: rawData.nombreCompleto });
                  if (rawData.direccion) formattedFields.push({ label: 'Dirección', value: rawData.direccion });
                  if (rawData.motivo) formattedFields.push({ label: 'Motivo de adopción', value: rawData.motivo });
                  
                  if (rawData.cuestionario && Array.isArray(rawData.cuestionario)) {
                    rawData.cuestionario.forEach((q: any) => {
                       formattedFields.push({ label: q.pregunta || 'Pregunta', value: q.respuesta || '' });
                    });
                  }
                  sol.formulario = formattedFields;
                }
                return sol;
              });
          }
        });
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error("Error al cargar solicitudes para los chats flotantes:", error);
    }
  }

  listenMessages() {
    this.messageSub = this.chatService.escucharNuevosMensajes().subscribe((mensaje: any) => {
      const chat = this.conversaciones.find(c => c.id === mensaje.chatId);
      if (chat) {
        const msgId = mensaje.id || mensaje.idMensaje;
        const existe = chat.mensajes.some(m => m.id === msgId);
        if (!existe) {
          const nuevoMsg: Mensaje = {
            id: msgId,
            texto: mensaje.mensaje,
            esMio: mensaje.idRemitente === this.authService.currentUser()?.id,
            hora: new Date(mensaje.fechaEnvio || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          chat.mensajes.push(nuevoMsg);
          
          if (!this.isOpen) {
            this.hasUnread = true;
          }
          this.cdr.detectChanges();
        }
      }
    });
  }

  abrirChat(chat: ChatThread) {
    this.chatActivo = chat;
    this.chatService.obtenerMensajes(chat.id).subscribe({
      next: (response: any) => {
        if (response && response.data && this.chatActivo) {
          this.chatActivo.mensajes = response.data.map((msg: any) => ({
            id: msg.id || msg.idMensaje,
            texto: msg.mensaje,
            esMio: msg.idRemitente === this.authService.currentUser()?.id,
            hora: new Date(msg.fechaEnvio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          this.cdr.detectChanges();
        }
      }
    });
  }

  cerrarChat() {
    this.chatActivo = null;
  }
}
