import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { AlertsService } from '../../services/alerts-service';

@Component({
  selector: 'app-modal-registro',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './modal-registro.html',
  styleUrl: './modal-registro.css',
})
export class ModalRegistro {

  @Output() cerrar = new EventEmitter<void>();

  private authService = inject(AuthService);
  private alertsService = inject(AlertsService);

  isClosing = signal<boolean>(false);
  mostrarPassword = signal<boolean>(false);
  cargando = signal<boolean>(false);

  nuevoUsuario = {
    nombre: '',
    correo: '',
    contrasena: '',
  };

  constructor() {}

  togglePassword() {
    this.mostrarPassword.update(v => !v);
  }

  cerrarModal() {
    if (this.isClosing()) return;

    this.isClosing.set(true);

    setTimeout(() => {
      this.cerrar.emit();
    }, 300); 
  }

  async onRegister(form: NgForm) {
    if (form.valid) {
      console.log('Iniciando proceso de registro...');
      await this.enviarRegistro();
    }
  }

  async enviarRegistro() {
    this.cargando.set(true);

    try {
      await this.authService.registro(this.nuevoUsuario);
      this.alertsService.success('Registro exitoso', 'Tu cuenta ha sido creada y has iniciado sesión.');
      this.cerrarModal();
    } catch (error) {
      this.alertsService.error('Error al registrar usuario', 'Hubo un problema al crear tu cuenta. Intenta con otro correo');
    } finally {
      this.cargando.set(false);
    }
  }
}
