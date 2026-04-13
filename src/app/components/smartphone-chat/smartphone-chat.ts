import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatThread, Mensaje } from '../../interfaces/chat';

@Component({
  selector: 'app-smartphone-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './smartphone-chat.html',
  styleUrl: './smartphone-chat.css',
})
export class SmartphoneChatComponent {
  private fb = inject(FormBuilder);

  @Input() chatActivo: ChatThread | null = null;
  @Output() cerrarVisor = new EventEmitter<void>();

  mensajeForm = this.fb.group({
    nuevoMensaje: ['', Validators.required]
  });

  cerrarChat() {
    this.cerrarVisor.emit();
  }

  enviarMensaje() {
    if (this.mensajeForm.valid && this.chatActivo) {
      const msjTexto = this.mensajeForm.value.nuevoMensaje || '';
      
      const nuevo: Mensaje = {
        id: Date.now(),
        texto: msjTexto,
        esMio: true,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      this.chatActivo.mensajes.push(nuevo);
      this.mensajeForm.reset();
      
      const input = document.getElementById('chatInputObj') as HTMLTextAreaElement;
      if (input) input.style.height = 'auto';

      setTimeout(() => this.scrollToBottom(), 50);
    }
  }

  scrollToBottom() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
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
