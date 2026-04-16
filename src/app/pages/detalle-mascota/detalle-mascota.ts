import { Component, inject, input, output, signal, ChangeDetectorRef} from '@angular/core';
import { Animal } from '../../interfaces/animal';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../services/animal';
import { AlertsService } from '../../services/alerts-service';

@Component({
  selector: 'app-detalle-mascota',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-mascota.html',
  styleUrl: './detalle-mascota.css',
})
export class DetalleMascota {
  private route = inject(ActivatedRoute);
  private animalService = inject(AnimalService);
  private alertService = inject(AlertsService);
  private cdr = inject(ChangeDetectorRef);

  //Signal del animal actual
  animal = signal<Animal | undefined>(undefined);

  async ngOnInit() {
    //obtenemos la id
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (id) {
      await this.cargarAnimal(id);
      this.cdr.detectChanges();
    } else {
      this.alertService.error('Error de Archivo', 'El ID del expediente no es válido.');
    }
  }
  private async cargarAnimal(id: number) {
    try {
      const data = await this.animalService.obtenerPorId(id);

      if (data) {
        this.animal.set(data);
      } else {
        this.alertService.warning(
          'Expediente Extraviado',
          'No se encontró ningún registro con ese número de folio.',
        );
      }
    } catch (error) {
      console.error('Error al consultar el expediente:', error);
      this.alertService.error(
        'Fallo de Conexión',
        'No se pudo establecer comunicación con el archivo central de la Gaceta.',
      );
    }
  }
}
