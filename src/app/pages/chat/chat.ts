import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatThread, Mensaje } from '../../interfaces/chat';
import { SmartphoneChatComponent } from '../../components/smartphone-chat/smartphone-chat';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, SmartphoneChatComponent],
  standalone: true,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  chatActivo: ChatThread | null = null;
  filtroBusqueda = '';

  conversaciones: ChatThread[] = [
    {
      id: 1,
      nombreCandidato: 'Narvaez Jose Luis',
      animalId: 1,
      animalNombre: 'Gatillo',
      avatar: 'https://ui-avatars.com/api/?name=Jose+N&background=edd8d3&color=a14a38',
      noLeidos: 2,
      mensajes: [
        { id: 101, texto: '¡Hola! Estoy muy interesada en adoptar a Gatillo.', esMio: false, hora: '10:00 AM' },
        { id: 102, texto: 'Hola Laura, ¡qué alegría! Gatillo es muy enérgico. ¿Tienes jardín en casa?', esMio: true, hora: '10:05 AM' },
        { id: 103, texto: 'Sí, tengo un patio trasero grande y bardeado.', esMio: false, hora: '10:07 AM' },
        { id: 104, texto: '¿Qué alimentación le estás dando actualmente? Me gustaría continuar su dieta.', esMio: false, hora: '10:08 AM' },
      ]
    },
    {
      id: 2,
      nombreCandidato: 'Santos Emiliano',
      animalId: 3,
      animalNombre: 'Chispa',
      avatar: 'https://ui-avatars.com/api/?name=Emiliano+S&background=d3e0ed&color=386ca1',
      noLeidos: 0,
      mensajes: [
        { id: 201, texto: 'Buenas tardes, acabo de llenar la solicitud para Chispa.', esMio: false, hora: 'Ayer' },
        { id: 202, texto: 'Excelente Emiliano. Estoy revisando tus referencias.', esMio: true, hora: 'Ayer' },
        { id: 203, texto: 'De acuerdo, quedo al pendiente.', esMio: false, hora: 'Ayer' },
      ]
    }
  ];

  get conversacionesFiltradas() {
    return this.conversaciones.filter(c => 
      c.nombreCandidato.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) || 
      c.animalNombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
  }

  abrirChat(chat: ChatThread) {
    this.chatActivo = chat;
    chat.noLeidos = 0;
  }

  cerrarChat() {
    this.chatActivo = null;
  }

  actualizarFiltro(event: any) {
    this.filtroBusqueda = event.target.value;
  }
}
