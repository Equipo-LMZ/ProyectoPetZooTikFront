import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ModalLogin } from '../../components/modal-login/modal-login';
import { ModalRegistro } from '../../components/modal-registro/modal-registro';
import { ModalCandidatura } from '../../components/modal-candidatura/modal-candidatura';
import { AuthService } from '../../services/auth';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ModalLogin, ModalRegistro, ModalCandidatura],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private navbarService = inject(NavbarService);

  mostrarHelicoptero = signal<boolean>(true);
  faseAnimacion = signal<number>(0);
  seleccionActual = signal<number>(0);
  modalAbierto = signal<'login' | 'registro' | 'candidatura' | null>(null);

  transicionNegro = signal<boolean>(false);

  transicionDesdeNegro = signal<boolean>(false);

  luciernagas = Array.from({ length: 35 }, () => ({
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 6 + 6}s`,
    animationDelay: `-${Math.random() * 10}s`
  }));

  constructor(private router: Router) {}

  ngOnInit() {
    this.navbarService.enPaginaInicio.set(true);
    
    if (window.history.state?.directoAlParque) {
      
      this.faseAnimacion.set(3);
      this.navbarService.faseInicio.set(3);

      this.transicionDesdeNegro.set(true);
      this.transicionDesdeNegro.set(true);

      setTimeout(() => {
        this.transicionDesdeNegro.set(false);
      }, 1000); 

      setTimeout(() => {
        this.transicionDesdeNegro.set(false);
      }, 500);

      window.history.replaceState({}, '');
      
    } else {
      this.navbarService.faseInicio.set(this.faseAnimacion());
    }
  }

  ngOnDestroy() {
    this.navbarService.enPaginaInicio.set(false);
    this.navbarService.faseInicio.set(-1);
  }

  private sincronizarFase(fase: number) {
    this.faseAnimacion.set(fase);
    this.navbarService.faseInicio.set(fase);
  }

  avanzarEscena() {
    if (this.faseAnimacion() !== 0) return;
  
    this.sincronizarFase(1);
    setTimeout(() => this.mostrarHelicoptero.set(false), 200);

    setTimeout(() => {
      if (this.authService.currentUser()) {
        this.ingresarAlParque();
      } else {
        this.sincronizarFase(2);
      }
    }, 300);
  }

  regresarInicio(event: Event) {
    event.stopPropagation();
    this.sincronizarFase(0);
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

    this.transicionNegro.set(true);

    setTimeout(() => {
      this.transicionDesdeNegro.set(true);
      this.sincronizarFase(3);
    }, 1100);

    setTimeout(() => {
      this.transicionNegro.set(false);
    }, 1350);
    setTimeout(() => {
      this.transicionDesdeNegro.set(false);
    }, 1450);
  }

  entrarComoInvitado() {
    this.ingresarAlParque();
  }

  cerrarSesion() {
    this.authService.logout();
    this.sincronizarFase(0);
    this.mostrarHelicoptero.set(true);
  }
}