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
  modalAbierto = signal<'login' | 'registro' | 'candidatura' | null>(null);

  /** true mientras el bosque hace zoom-in y se oscurece hacia negro */
  transicionNegro = signal<boolean>(false);

  /** true mientras el campamento está en zoom máximo (antes de hacer zoom-out) */
  transicionDesdeNegro = signal<boolean>(false);

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
    setTimeout(() => this.faseAnimacion.set(2), 300);
  }

  regresarInicio(event: Event) {
    event.stopPropagation();
    this.faseAnimacion.set(0);
    setTimeout(() => this.mostrarHelicoptero.set(true), 800);
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

  abrirPostulacion() {
    this.modalAbierto.set('candidatura');
  }

  abrirNoticias(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/mascotas']);
  }

  abrirGestion(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/panel']);
  }

  ingresarAlParque() {
    this.cerrarModales();

    // PASO 1 (0ms): El bosque hace zoom-in hacia el centro y se oscurece a negro
    this.transicionNegro.set(true);

    // PASO 2 (1100ms): Pantalla totalmente negra.
    // Ponemos el campamento en escala grande (invisible aún) y lo activamos (fase 3)
    setTimeout(() => {
      this.transicionDesdeNegro.set(true);
      this.faseAnimacion.set(3);
    }, 1100);

    // PASO 3 (1350ms): Quitamos el overlay negro — el campamento se vuelve visible (en zoom)
    setTimeout(() => {
      this.transicionNegro.set(false);
    }, 1350);

    // PASO 4 (1450ms): El campamento hace zoom-out hacia su tamaño normal
    setTimeout(() => {
      this.transicionDesdeNegro.set(false);
    }, 1450);
  }

  entrarComoInvitado() {
    this.ingresarAlParque();
  }
}