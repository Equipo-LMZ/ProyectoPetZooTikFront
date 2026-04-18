import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavbarService {
  faseInicio = signal<number>(-1);

  enPaginaInicio = signal<boolean>(false);

  public pedirModalLogin = signal<boolean>(false);

  get debeOcultarTodo(): boolean {
    return this.enPaginaInicio() && this.faseInicio() < 3;
  }
}
