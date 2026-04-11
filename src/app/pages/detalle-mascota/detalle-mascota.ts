import { Component, inject, input, output, signal } from '@angular/core';
import { Animal } from '../../interfaces/animal';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-mascota',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-mascota.html',
  styleUrl: './detalle-mascota.css',
})
export class DetalleMascota {
  private route = inject(ActivatedRoute);

  // Signal para manejar el animal actual
  animal = signal<Animal | undefined>(undefined);

  ngOnInit() {
    // Obtenemos el ID desde la ruta /detalle-mascota/1
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    // Aquí simulas la carga. En el futuro, llamarás a tu service.getAnimalById(id)
    this.cargarDatosMascota(id);
  }

  cargarDatosMascota(id: number) {
    // Datos de ejemplo que coinciden con tu interfaz
    const mockMascotas: Animal[] = [
      {
        id: 1,
        nombre: 'Mantequilla',
        descripcion:
          'Un gato naranja muy perezoso que ama dormir al sol. Es experto en cazar moscas imaginarias.',
        imagen: 'assets/mantequilla.png',
        tipoAnimal: 'Gato',
        lugarRescate: 'Parque Pelícano',
        ubicacionActual: 'Refugio Central',
      },
    ];

    const encontrado = mockMascotas.find((a) => a.id === id);
    this.animal.set(encontrado);
  }
}
