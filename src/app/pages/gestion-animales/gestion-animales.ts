import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Animal } from '../../interfaces/animal';

@Component({
  selector: 'app-gestion-animales',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './gestion-animales.html',
})
export class GestionAnimales implements OnInit {
  private fb = inject(FormBuilder);
  listaMascotas: Animal[] = [
    { id: 1, nombre: 'Gatillo', descripcion: 'Blanco con manchas grises y negras, ojos de color verde, muy juguetón', tipoAnimal: 'Gato', lugarRescate: 'Colonia Paso Blanco', ubicacionActual: 'Veterinarias Cañada Honda', imagen: null },
    { id: 2, nombre: 'Firulais', descripcion: 'Blanco con manchas grises y negras, ojos de color verde, muy juguetón', tipoAnimal: 'Perro', lugarRescate: 'Colonia Paso Blanco', ubicacionActual: 'Veterinarias Cañada Honda', imagen: null },
    { id: 3, nombre: 'Michi', descripcion: 'Blanco con manchas grises y negras, ojos de color verde, muy juguetón', tipoAnimal: 'Gato', lugarRescate: 'Colonia Paso Blanco', ubicacionActual: 'Veterinarias Cañada Honda', imagen: null },
    { id: 4, nombre: 'Firulais', descripcion: 'Blanco con manchas grises y negras, ojos de color verde, muy juguetón', tipoAnimal: 'Perro', lugarRescate: 'Colonia Paso Blanco', ubicacionActual: 'Veterinarias Cañada Honda', imagen: null },
    { id: 5, nombre: 'Michi', descripcion: 'Blanco con manchas grises y negras, ojos de color verde, muy juguetón', tipoAnimal: 'Gato', lugarRescate: 'Colonia Paso Blanco', ubicacionActual: 'Veterinarias Cañada Honda', imagen: null },
    { id: 6, nombre: 'Firulais', descripcion: 'Blanco con manchas grises y negras, ojos de color verde, muy juguetón', tipoAnimal: 'Perro', lugarRescate: 'Colonia Paso Blanco', ubicacionActual: 'Veterinarias Cañada Honda', imagen: null },
    { id: 8, nombre: 'Firulais', descripcion: 'Blanco con manchas grises y negras, ojos de color verde, muy juguetón', tipoAnimal: 'Perro', lugarRescate: 'Colonia Paso Blanco', ubicacionActual: 'Veterinarias Cañada Honda', imagen: null },
    { id: 10, nombre: 'Firulais', descripcion: 'Blanco con manchas grises y negras, ojos de color verde, muy juguetón', tipoAnimal: 'Perro', lugarRescate: 'Colonia Paso Blanco', ubicacionActual: 'Veterinarias Cañada Honda', imagen: null },
  ];

  mostrarFormulario = false;
  editando = false;
  mascotaSeleccionadaId: number | null = null;

  paginaActual = 1;
  itemsPorPagina = 6;

  get totalPaginas(): number {
    return Math.ceil(this.listaMascotas.length / this.itemsPorPagina);
  }

  get mascotasPaginadas(): Animal[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.listaMascotas.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas && nuevaPagina !== this.paginaActual) {
      this.paginaActual = nuevaPagina;
    }
  }

  mascotaForm = this.fb.group({
    imagen: [null, Validators.required],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    tipoAnimal: ['', Validators.required],
    lugarRescate: [''],
    ubicacionActual: [''],
  });

  ngOnInit() {
    this.cargarMascotas();
  }

  cargarMascotas() {
  }

  abrirFormularioNuevo() {
    this.editando = false;
    this.mascotaSeleccionadaId = null;
    this.mascotaForm.reset();
    this.mostrarFormulario = true;
  }

  editarMascota(mascota: Animal) {
    this.editando = true;
    this.mostrarFormulario = true;
    if (mascota.id !== undefined) {
      this.mascotaSeleccionadaId = mascota.id;
    }
    
    this.mascotaForm.get('imagen')?.clearValidators();
    this.mascotaForm.get('imagen')?.updateValueAndValidity();

    this.mascotaForm.patchValue({
      nombre: mascota.nombre,
      descripcion: mascota.descripcion,
      tipoAnimal: mascota.tipoAnimal,
      lugarRescate: mascota.lugarRescate,
      ubicacionActual: mascota.ubicacionActual,
    });
  }

  eliminarMascota(id: number | undefined) {
    if (id === undefined) return;
    
    console.log(`Eliminando mascota con ID: ${id}`);
    this.listaMascotas = this.listaMascotas.filter((m) => m.id !== id);
    
    if (this.mascotasPaginadas.length === 0 && this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  guardarMascota() {
    if (this.mascotaForm.valid) {
      const formData = new FormData();
      const valores = this.mascotaForm.value;
      
      formData.append('nombre', valores.nombre || '');
      formData.append('especie', valores.tipoAnimal || '');
      formData.append('rescuer_id', '1');
      
      const imagenFile = this.mascotaForm.get('imagen')?.value;
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      if (this.editando && this.mascotaSeleccionadaId) {
        console.log('Actualizando datos via formData...');
      } else {
        console.log('Registrando nueva mascota via formData...');
      }

      this.mostrarFormulario = false;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.mascotaForm.patchValue({ imagen: file });
      this.mascotaForm.get('imagen')?.updateValueAndValidity();
    }
  }
}
