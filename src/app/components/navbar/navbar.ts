import { Component, inject, signal, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarService } from '../../services/navbar.service';
import { CommonModule } from '@angular/common';
import { ModalLogin } from '../modal-login/modal-login';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule, ModalLogin],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  public authService = inject(AuthService);
  public navbarService = inject(NavbarService);
  private router = inject(Router);

  verModal = signal<boolean>(false);

  navVisible = signal<boolean>(false);

  abrirLogin() {
    this.verModal.set(true);
  }

  cerrarLogin() {
    this.verModal.set(false);
  }

  menuAbierto = signal(false);
  toggleMenu() {
    this.menuAbierto.update((v) => !v);
  }

  cerrarMenu() {
    this.menuAbierto.set(false);
  }

  logout() {
    this.authService.logout();
    this.cerrarMenu();
  }

  mostrarNav() {
    this.navVisible.set(true);
  }

  ocultarNav() {
    this.navVisible.set(false);
  }

  get ocultarTodo(): boolean {
    return this.navbarService.debeOcultarTodo;
  }
}
