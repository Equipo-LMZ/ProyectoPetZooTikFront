import { Component, computed, inject, signal } from '@angular/core';
import { Animal } from '../../interfaces/animal';
import { AnimalService } from '../../services/animal';
import { AlertsService } from '../../services/alerts-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mascotas',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css',
})
export class Mascotas {
  public animalService = inject(AnimalService);
  private alertService = inject(AlertsService);

  public filtroActual = signal<string>('todos');

  public mascotasFiltradas = computed(() => {
    const lista = this.animalService.listaAnimales();
    const filtro = this.filtroActual().toLowerCase();

    if (filtro === 'todos') return lista;

    return lista.filter((animal) => {
      const tipo = animal.tipo.toLowerCase();
      if (filtro === 'canino') return tipo === 'canino' || tipo === 'perro';
      if (filtro === 'felino') return tipo === 'felino' || tipo === 'gato';
      return tipo === filtro;
    });
  });

  async ngOnInit() {
    try {
      await this.animalService.obtenerAnimales();
    } catch (error) {
      this.alertService.error('¡Error!', 'No pudimos sincronizar los animales.');
    }
  }

  cambiarFiltro(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filtroActual.set(value);
  }
}
