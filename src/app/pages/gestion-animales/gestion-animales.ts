import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Animal } from '../../interfaces/animal';
import { AnimalService } from '../../services/animal';
import { AuthService } from '../../services/auth';
import { AlertsService } from '../../services/alerts-service';

@Component({
  selector: 'app-gestion-animales',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './gestion-animales.html',
})
export class GestionAnimales implements OnInit {
  private fb = inject(FormBuilder);

  private animalService = inject(AnimalService);
  private authService = inject(AuthService);
  private alertsService = inject(AlertsService);

  private cdr = inject(ChangeDetectorRef);

  listaMascotas: Animal[] = [];

  mostrarFormulario = false;
  editando = false;
  guardando = false;
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
    imagen: [null as any, Validators.required],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    tipo: ['', Validators.required],
    otrotipo: [''],
    lugar: [''],
    ubicacion: [''],
  });

  ngOnInit() {
    this.cargarMascotas();
  }

  async cargarMascotas() {
    const idUsuario = this.authService.currentUser()?.id;
    if (!idUsuario) return;

    try {
      await this.animalService.obtenerMisMascotas(idUsuario);

      this.listaMascotas = this.animalService.listaAnimales();

      this.cdr.detectChanges();

    } catch (error) {
      // ya lo hace serive
      // this.alertsService.error('Error', 'No se pudieron cargar las mascotas');
    }
  }

  abrirFormularioNuevo() {
    this.editando = false;
    this.mascotaSeleccionadaId = null;
    this.mascotaForm.reset();
    this.mascotaForm.get('tipo')?.setValue('');
    this.mascotaForm.get('imagen')?.setValidators(Validators.required);
    this.mascotaForm.get('imagen')?.updateValueAndValidity();
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

    const tiposConocidos = ['Perro', 'Gato', 'Ave'];
    const esConocido = tiposConocidos.includes(mascota.tipo);

    this.mascotaForm.patchValue({
      nombre: mascota.nombre,
      descripcion: mascota.descripcion,
      tipo: esConocido ? mascota.tipo : 'Otro',
      otrotipo: esConocido ? '' : mascota.tipo,
      lugar: mascota.lugar,
      ubicacion: mascota.ubicacion,
    });
  }

  async eliminarMascota(id: number | undefined) {
    if (id === undefined) return;

    if (confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
      try {
        await this.animalService.eliminarAnimal(id);
        this.alertsService.success('Eliminado', 'Mascota eliminada correctamente');

        await this.cargarMascotas();

        if (this.mascotasPaginadas.length === 0 && this.paginaActual > 1) {
          this.paginaActual--;
        }
      } catch (error) {
        // se maneja en service
        // this.alertsService.error('Error', 'No se pudo eliminar la mascota');
      }
    }
  }

  async guardarMascota() {
    if (this.mascotaForm.valid) {
      this.guardando = true;

      const valores = this.mascotaForm.value;
      const formData = new FormData();

      const tipoFinal = valores.tipo === 'Otro' ? valores.otrotipo : valores.tipo;
      const idUsuarioActual = this.authService.currentUser()?.id;

      formData.append('nombre', valores.nombre || '');
      formData.append('idRescatista', idUsuarioActual?.toString() || '');
      formData.append('descripcion', valores.descripcion || '');
      formData.append('tipo', tipoFinal || '');
      formData.append('lugar', valores.lugar || '');
      formData.append('ubicacion', valores.ubicacion || '');

      const imagenFile = this.mascotaForm.get('imagen')?.value;
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      try {
        if (this.editando && this.mascotaSeleccionadaId) {
          await this.animalService.actualizarAnimal(this.mascotaSeleccionadaId, formData);
          this.alertsService.success('Actualizado', 'Mascota actualizada correctamente');
        } else {
          await this.animalService.crearAnimal(formData);
          this.alertsService.success('Registrado', 'Mascota creada correctamente');
        }

        this.mostrarFormulario = false;
        await this.cargarMascotas();
      } catch (error) {
        // ya lo maneja services
        // this.alertsService.error(
        //   'Error al Guardar',
        //   'Revisa la conexión o los campos del formulario.',
        // );
      } finally {
        this.guardando = false;
      }
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.mascotaForm.patchValue({ imagen: file });
      this.mascotaForm.get('imagen')?.updateValueAndValidity();
    } else {
      this.alertsService.error('Error de archivo', 'No se pudo cargar la imagen seleccionada.');
    }
  }
}
