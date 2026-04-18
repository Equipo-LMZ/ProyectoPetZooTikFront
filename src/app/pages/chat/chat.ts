import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatThread, Mensaje } from '../../interfaces/chat';
import { SmartphoneChatComponent } from '../../components/smartphone-chat/smartphone-chat';
import { ChatService } from '../../services/chat-service';
import { AuthService } from '../../services/auth';
import { AnimalService } from '../../services/animal';
import { AlertsService } from '../../services/alerts-service';

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
  miId: number = 0;

  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private animalService = inject(AnimalService);
  private alertsService = inject(AlertsService);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.miId = currentUser.id;
      this.chatService.conectarUsuarioGlobal(this.miId);
    }

    this.chatService.obtenerMisChats().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.conversaciones = response.data.map((chatInfo: any) => {
            // Generamos las iniciales para el avatar usando el nombre que trae el backend
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(chatInfo.nombreCandidato || 'Usuario')}&background=random`;

            return {
              id: chatInfo.id || chatInfo.idChat,
              nombreCandidato: chatInfo.nombreCandidato || 'Usuario Desconocido',
              idAdoptante: chatInfo.idAdoptante,
              idRescatista: chatInfo.idRescatista,
              animalId: 0,
              animalNombre: (() => {
                const parts = (chatInfo.id || chatInfo.idChat || '').split('_');
                return parts.length > 1 ? parts[1] : '';
              })(),
              avatar: avatarUrl,
              mensajes: [],
              formularios: [],
            } as ChatThread;
          });

          // Unirse a las salas de socket para cada chat
          this.conversaciones.forEach((chat) => {
            this.chatService.unirseSala(chat.id);
          });

          // Obtener solicitudes y cruzarlas
          this.cargarFormularios();

          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.alertsService.error(
          'Fallo de Sincronización',
          'No pudimos recuperar tu lista de mensajes. Inténtalo de nuevo más tarde.',
        );
      },
    });

    // Escuchar mensajes entrantes globales
    this.chatService.escucharNuevosMensajes().subscribe((mensaje: any) => {
      // Ignoramos si lo enviamos nosotros (ya lo agregamos localmente)
      if (mensaje.user_id === this.miId) return;

      const chatTarget = this.conversaciones.find((c) => c.id == mensaje.chat_id);
      if (chatTarget) {
        chatTarget.mensajes.push({
          id: Date.now(), // Temporaly id ya que kafka no devuelve insertId
          texto: mensaje.contenido,
          esMio: false,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          imagen: mensaje.imagen,
        });
        this.cdr.detectChanges();
      }
    });
  }

  async cargarFormularios() {
    try {
      const solicitudes = await this.animalService.obtenerSolicitudesRecibidas();

      this.conversaciones.forEach((chat) => {
        if (chat.idAdoptante && chat.idRescatista) {
          chat.formularios = solicitudes
            .filter(
              (sol: any) => sol.idUser == chat.idAdoptante && sol.idRescatista == chat.idRescatista,
            )
            .map((sol: any) => {
              let rawData = sol.formulario;
              if (typeof rawData === 'string') {
                try {
                  rawData = JSON.parse(rawData);
                } catch (e) {
                  this.alertsService.warning(
                    'Documento Ilegible',
                    'Un expediente de adopción no se pudo cargar correctamente.',
                  );
                  return sol;
                }
              }

              // Convertimos a array de campos para la UI
              if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
                const formattedFields = [];

                if (rawData.nombreCompleto)
                  formattedFields.push({ label: 'Nombre Completo', value: rawData.nombreCompleto });
                if (rawData.direccion)
                  formattedFields.push({ label: 'Dirección', value: rawData.direccion });
                if (rawData.motivo)
                  formattedFields.push({ label: 'Motivo de adopción', value: rawData.motivo });

                if (rawData.cuestionario && Array.isArray(rawData.cuestionario)) {
                  rawData.cuestionario.forEach((q: any) => {
                    formattedFields.push({
                      label: q.pregunta || 'Pregunta',
                      value: q.respuesta || '',
                    });
                  });
                }

                sol.formulario = formattedFields;
              }
              return sol;
            });
        }
      });
      this.cdr.detectChanges();
    } catch (error) {
      this.alertsService.error(
        'Error de Datos',
        'No pudimos cruzar la información de las solicitudes con tus chats.',
      );
    }
  }

  get conversacionesFiltradas() {
    if (!this.conversaciones) return [];
    return this.conversaciones.filter((c) => {
      const nombre = c.nombreCandidato || '';
      const animal = c.animalNombre || '';
      const filtro = this.filtroBusqueda || '';
      return (
        nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        animal.toLowerCase().includes(filtro.toLowerCase())
      );
    });
  }

  abrirChat(chat: ChatThread) {
    this.chatActivo = chat;

    // Obtener el historial de la BD
    this.chatService.obtenerMensajes(chat.id).subscribe({
      next: (response) => {
        if (response && response.data) {
          chat.mensajes = response.data.map((msg: any) => {
            return {
              id: msg.idMensaje || Date.now(),
              texto: msg.contenido,
              esMio: msg.idRemitente === this.miId,
              hora: new Date(msg.fechaEnvio).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              imagen: msg.imagen,
            };
          });
          this.cdr.detectChanges();
        }
      },
      error: (err) =>
        this.alertsService.error(
          'Historial no disponible',
          'No logramos traer los mensajes anteriores de la base de datos.',
        ),
    });
  }

  cerrarChat() {
    this.chatActivo = null;
  }

  actualizarFiltro(event: any) {
    this.filtroBusqueda = event.target.value;
  }
}
