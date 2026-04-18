import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatThread, Mensaje } from '../../interfaces/chat';
import { ChatService } from '../../services/chat-service';

@Component({
  selector: 'app-smartphone-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './smartphone-chat.html',
  styleUrl: './smartphone-chat.css',
})
export class SmartphoneChatComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);
  private cdr = inject(ChangeDetectorRef);

  @Input() chatActivo: ChatThread | null = null;
  @Input() conversaciones: ChatThread[] = [];
  @Output() cerrarVisor = new EventEmitter<void>();
  @Output() abrirVisor = new EventEmitter<ChatThread>();

  filtroBusqueda = '';
  mostrarPerfil = false;

  mensajeForm = this.fb.group({
    nuevoMensaje: ['']
  });

  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chatActivo']) {
      this.mostrarPerfil = false;
    }
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

  actualizarFiltro(event: any) {
    this.filtroBusqueda = event.target.value;
  }

  seleccionarChat(chat: ChatThread) {
    this.abrirVisor.emit(chat);
  }

  cerrarChat() {
    this.mostrarPerfil = false;
    this.cerrarVisor.emit();
  }

  togglePerfil() {
    this.mostrarPerfil = !this.mostrarPerfil;
    if (this.mostrarPerfil) {
      setTimeout(() => this.scrollToBottom(), 50);
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        console.error("Solo se permiten imágenes");
        return;
      }
      this.imagenSeleccionada = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 50);
      };
      reader.readAsDataURL(file);
    }
  }

  removerImagen() {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
    const fileInput = document.getElementById('chatImageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.cdr.detectChanges();
  }

  getImageUrl(ruta: string | undefined): string {
    if (!ruta) return '';
    if (ruta.startsWith('data:image')) return ruta;
    if (ruta.startsWith('http')) return ruta;
    return `https://api.petzootik.site${ruta}`;
  }

  enviarMensaje() {
    const msjTexto = this.mensajeForm.value.nuevoMensaje?.trim() || '';
    
    if ((msjTexto !== '' || this.imagenSeleccionada) && this.chatActivo) {
      const nuevo: Mensaje = {
        id: Date.now(),
        texto: msjTexto,
        esMio: true,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        imagen: this.imagenPreview || undefined
      };
      
      this.chatActivo.mensajes.push(nuevo);
      
      const imgFile = this.imagenSeleccionada;
      
      this.mensajeForm.reset();
      this.removerImagen();
      
      const input = document.getElementById('chatInputObj') as HTMLTextAreaElement;
      if (input) input.style.height = 'auto';

      setTimeout(() => this.scrollToBottom(), 50);

      // Enviar al backend
      this.chatService.enviarMensaje(this.chatActivo.id, msjTexto, imgFile || undefined).subscribe({
        error: (err) => console.error('Error enviando mensaje', err)
      });
    }
  }

  scrollToBottom() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  getNombreMascota(idMascota: number): string {
    const id = this.chatActivo?.id ?? '';
    if (id.includes('_')) {
      return id.split('_')[1] ?? 'Mascota';
    }
    return 'Mascota #' + idMascota;
  }

  autoResize(event: any) {
    const textarea = event.target;
    const oldHeight = textarea.style.height;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 110) + 'px';
    
    if (oldHeight !== textarea.style.height) {
      this.scrollToBottom();
    }
  }
}
