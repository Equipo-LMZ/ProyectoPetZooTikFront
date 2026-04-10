import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal-login',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './modal-login.html',
  styleUrl: './modal-login.css',
})
export class ModalLogin {
  
  credenciales = {
    correo: '',
    contrasena: '',
  };

  constructor() {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.intentarLogin();
    }
  }

  async intentarLogin() {
    console.log('Datos a enviar:', this.credenciales);

    try {
      /* Paso 1: Intentar en endpoint de Rescatista 
         /user/rescuers
      */
      const esRescatista = await this.checkRescatista();
      console.log('Sesión iniciada como Rescatista');
    } catch (error: any) {
      /* Paso 2: Si el error es 404, no es rescatista.
         Intentamos en el endpoint de usuario normal
      */
      if (error.status === 404) {
        this.loginUsuarioNormal();
      } else {
        console.error('Error de conexión o credenciales incorrectas');
      }
    }
  }

  private loginUsuarioNormal() {
    // Aquí es donde harías el POST al endpoint de tu curl:
    // /user/login
    console.log('404 en Rescatista. Intentando login en /user/login...');

    // Si tiene éxito, rediriges al dashboard de usuario
    console.log('Sesión iniciada como Usuario Normal');
  }

  // Simulación del primer intento
  private checkRescatista(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulamos que el correo no está en la base de rescatistas
      reject({ status: 404 });
    });
  }
}
