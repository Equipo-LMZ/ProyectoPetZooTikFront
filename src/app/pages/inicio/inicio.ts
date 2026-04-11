import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ModalLogin } from '../../components/modal-login/modal-login';
import { ModalRegistro } from '../../components/modal-registro/modal-registro';
import { ModalCandidatura } from '../../components/modal-candidatura/modal-candidatura';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ModalLogin, ModalRegistro, ModalCandidatura],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  mostrarHelicoptero = signal<boolean>(true);
  faseAnimacion = signal<number>(0);
  seleccionActual = signal<number>(0);

  constructor(private router: Router) {}

  avanzarEscena() {
    if (this.faseAnimacion() !== 0) return;

    this.faseAnimacion.set(1);
    setTimeout(() => this.mostrarHelicoptero.set(false), 200);

    setTimeout(() => {
      this.faseAnimacion.set(2);
    }, 300);
  }

  setHover(opcion: number) {
    this.seleccionActual.set(opcion);
  }

  ejecutarAccion() {
    const seleccion = this.seleccionActual();
    
    if (seleccion === 1) {
      console.log('Abrir Modal Iniciar Sesión');
    } else if (seleccion === 2) {
      console.log('Abrir Modal Registro');
    } else {
      this.entrarComoInvitado();
    }
  }

  irAlMapa() {
    this.router.navigate(['/mapa']);
  }

  entrarComoInvitado() {
    this.router.navigate(['/mascotas']);
  }
}