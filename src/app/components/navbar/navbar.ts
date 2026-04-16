import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ModalLogin } from '../modal-login/modal-login';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ModalLogin],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  public authService = inject(AuthService);
  private router = inject(Router);

  // Control del modal
  verModal = signal<boolean>(false);

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
    this.router.navigate(['/']);
  }
}
