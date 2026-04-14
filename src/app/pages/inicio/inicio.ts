import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ModalLogin } from '../../components/modal-login/modal-login';
import { ModalRegistro } from '../../components/modal-registro/modal-registro';
import { ModalCandidatura } from '../../components/modal-candidatura/modal-candidatura';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ModalLogin, ModalRegistro, ModalCandidatura],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  public authService = inject(AuthService);

  mostrarHelicoptero = signal<boolean>(true);
  faseAnimacion = signal<number>(0);
  seleccionActual = signal<number>(0);
  
  modalAbierto = signal<'login' | 'registro' | null>(null);

  luciernagas = Array.from({ length: 35 }, () => ({
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 6 + 6}s`, 
    animationDelay: `-${Math.random() * 10}s` 
  }));

  constructor(private router: Router) {}

  avanzarEscena() {
    if (this.faseAnimacion() !== 0) return;

    this.faseAnimacion.set(1);
    setTimeout(() => this.mostrarHelicoptero.set(false), 200);

    setTimeout(() => {
      this.faseAnimacion.set(2);
    }, 300);
  }

    regresarInicio(event: Event) {
    event.stopPropagation();
    
    this.faseAnimacion.set(0);
    
    setTimeout(() => {
      this.mostrarHelicoptero.set(true);
    }, 800);
  }
  
  setHover(opcion: number) {
    this.seleccionActual.set(opcion);
  }

  ejecutarAccion() {
    const seleccion = this.seleccionActual();
    
    if (seleccion === 1) {
      this.modalAbierto.set('login');
    } else if (seleccion === 2) {
      this.modalAbierto.set('registro');
    } else {
      this.entrarComoInvitado();
    }
  }

  cerrarModales() {
    this.modalAbierto.set(null);
  }

  irAlMapa() {
    this.router.navigate(['/mapa']);
  }

  entrarComoInvitado() {
    this.router.navigate(['/mascotas']);
  }
}