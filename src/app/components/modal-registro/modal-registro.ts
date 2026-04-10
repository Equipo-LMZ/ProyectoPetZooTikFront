import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal-registro',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './modal-registro.html',
  styleUrl: './modal-registro.css',
})
export class ModalRegistro {
  // Objeto que mapea exactamente a tu JSON del curl
  nuevoUsuario = {
    nombre: '',
    correo: '',
    contrasena: '',
  };

  constructor() {}

  async onRegister(form: NgForm) {
    if (form.valid) {
      console.log('Iniciando proceso de registro...');
      await this.enviarRegistro();
    }
  }

  async enviarRegistro() {
    try {
      /* Aquí se realizaría el POST a:
         /user/register
         Enviando: this.nuevoUsuario
      */
      console.log('Enviando datos al servidor:', this.nuevoUsuario);

      // Simulación de respuesta exitosa
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    } catch (error) {
      console.error('Error al registrar usuario', error);
    }
  }
}
