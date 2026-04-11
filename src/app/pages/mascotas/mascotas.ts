import { Component } from '@angular/core';
import { Animal } from '../../interfaces/animal';

@Component({
  selector: 'app-mascotas',
  imports: [],
  standalone: true,
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css',
})
export class Mascotas {
  listaAnimales: Animal[] = [
    {
      id: 1,
      nombre: 'Mantequilla',
      descripcion:
        'Un gato naranja muy perezoso que ama dormir al sol. Es experto en cazar moscas imaginarias.',
      imagen: 'assets/pixel-cat.png',
      tipoAnimal: 'Gato',
      lugarRescate: 'Granja Pelican',
      ubicacionActual: 'Refugio Central',
    },
    // ... más animalitos
  ];

  abrirModalAdopcion(animal: Animal) {
    console.log('Abriendo formulario de adopción para:', animal.nombre);
    // Aquí dispararías el modal que hicimos anteriormente
  }
}
