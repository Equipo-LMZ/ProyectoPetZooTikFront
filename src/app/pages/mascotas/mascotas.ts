import { Component, inject } from '@angular/core';
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
  // Inyectamos el servicio
  public animalService = inject(AnimalService);
  private alertService = inject(AlertsService);

  async ngOnInit() {
    try {
      await this.animalService.obtenerAnimales();
    } catch (error) {
      this.alertService.error('¡Error!', 'No pudimos sincronizar los animales con el servidor.');
    }
  }
}
