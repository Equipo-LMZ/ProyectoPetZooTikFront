import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { AlertsService } from '../../services/alerts-service';

@Component({
  selector: 'app-modal-login',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './modal-login.html',
  styleUrl: './modal-login.css',
})
export class ModalLogin {

  @Output() cerrar = new EventEmitter<void>();

  private authService = inject(AuthService);
  private alertsService = inject(AlertsService);

  isClosing = signal<boolean>(false);
  mostrarPassword = signal<boolean>(false);
  cargando = signal<boolean>(false);

  credenciales = {
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
    setTimeout(() => {this.cerrar.emit();}, 300); 
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.intentarLogin();
    }
  }

  async intentarLogin() {
    this.cargando.set(true);
    console.log('Datos a enviar:', this.credenciales);

    try {
      await this.authService.login(this.credenciales);
      this.alertsService.success('Login exitoso', 'Has iniciado sesión correctamente.');
      this.cerrarModal();
    } catch (error: any) {
      if (error.status === 404) {
        this.alertsService.error('Error al iniciar sesión', 'El usuario no existe.');
      } else {
        this.alertsService.error('Error al iniciar sesión', 'El usuario no existe.');
      }
    } finally{
      this.cargando.set(false);
    }
  }
}
