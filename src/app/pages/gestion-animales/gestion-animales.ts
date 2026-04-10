import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Animal } from '../../interfaces/animal';

@Component({
  selector: 'app-gestion-animales',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './gestion-animales.html',
  styleUrl: './gestion-animales.css',
})
export class GestionAnimales {
  private fb = inject(FormBuilder);

  listaMascotas: Animal[] = [];

  mostrarFormulario = false;
  editando = false;

  // Formulario con validadores
  mascotaForm = this.fb.group({
    imagen: [null, Validators.required],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    tipoAnimal: ['', Validators.required],
    lugarRescate: ['', Validators.required],
    ubicacionActual: ['', Validators.required],
  });

  abrirFormularioNuevo() {
    this.editando = false;
    this.mascotaForm.reset();
    this.mostrarFormulario = true;
  }

  // Usamos el mismo tipo 'Animal' que en la lista
  editarMascota(mascota: Animal) {
    this.editando = true;
    this.mostrarFormulario = true;

    // El patchValue llenará el formulario con los datos de la mascota seleccionada
    this.mascotaForm.patchValue({
      nombre: mascota.nombre,
      descripcion: mascota.descripcion,
      tipoAnimal: mascota.tipoAnimal,
      lugarRescate: mascota.lugarRescate,
      ubicacionActual: mascota.ubicacionActual,
      // La imagen usualmente no se "parchea" por seguridad del navegador
    });
  }

  eliminarMascota(id: number | undefined) {
    // Si el ID no existe, detenemos la ejecución
    if (id === undefined) return;

    // Aquí TypeScript ya sabe con seguridad que 'id' es un número
    console.log('Eliminando mascota con ID:', id);
    this.listaMascotas = this.listaMascotas.filter((m) => m.id !== id);
  }
  guardarMascota() {
    if (this.mascotaForm.valid) {
      const datos = this.mascotaForm.value;
      console.log(this.editando ? 'Actualizando animal...' : 'Creando nuevo registro...', datos);
      this.mostrarFormulario = false;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.mascotaForm.patchValue({ imagen: file });
    }
  }
}
