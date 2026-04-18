import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RescatistaService } from '../../services/rescatista-service';
import { AlertsService } from '../../services/alerts-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-candidatura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-candidatura.html',
  styleUrl: './modal-candidatura.css',
})
export class ModalCandidatura {
  private rescatistaService = inject(RescatistaService);
  private alertService = inject(AlertsService);

  @Output() cerrar = new EventEmitter<void>();

  previewImagen = signal<string | null>(null);
  selectedFile: File | null = null;

  datos = {
    fecha: new Date().toISOString().split('T')[0],
    biografia: '',
    residencia: '',
    userId: '2',
  };

  cerrarModal() {
    this.cerrar.emit();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewImagen.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async enviar() {
    if (!this.selectedFile) {
      this.alertService.warning(
        '¡Falta Evidencia!',
        'Debes incluir una fotografía tuya para confirmar tu identidad.',
      );
      return;
    }

    try {
      await this.rescatistaService.enviarSolicitud(this.datos, this.selectedFile);
      this.alertService.success(
        '¡Cartel Publicado!',
        'Tu solicitud ha sido enviada a los administradores para validar o denegar tu solicitud',
      );
      this.cerrarModal();
    } catch (error) {
      this.alertService.error(
        'Fallo al momento de enviar tu solicitud',
        'No se pudo enviar tu solicitud correctamente, intentalo de nuevo más tarde',
      );
    }
  }
}
