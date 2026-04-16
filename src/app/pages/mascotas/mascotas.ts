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
  public filtroBusqueda = signal<string>('');

  public mascotasFiltradas = computed(() => {
    const lista = this.animalService.listaAnimales();
    const filtroEspecie = this.filtroActual().toLowerCase();
    const textoBusqueda = this.filtroBusqueda().toLowerCase().trim();

    return lista.filter((animal) => {
      let coincideEspecie = true;
      if (filtroEspecie !== 'todos') {
        const tipo = animal.tipo.toLowerCase();
        if (filtroEspecie === 'canino') coincideEspecie = tipo === 'canino' || tipo === 'perro';
        else if (filtroEspecie === 'felino') coincideEspecie = tipo === 'felino' || tipo === 'gato';
        else coincideEspecie = tipo === filtroEspecie;
      }

      const coincideTexto =
        animal.nombre.toLowerCase().includes(textoBusqueda) ||
        animal.descripcion.toLowerCase().includes(textoBusqueda);

      return coincideEspecie && coincideTexto;
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

  actualizarBusqueda(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filtroBusqueda.set(value);
  }
}
