import { Component, inject, input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../services/alerts-service';
import { AnimalService } from '../../services/animal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adoptar',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './adoptar.html',
  styleUrl: './adoptar.css',
})
export class Adoptar {
  private fb = inject(FormBuilder);
  private animalService = inject(AnimalService);
  private alertService = inject(AlertsService);
  private router = inject(Router);

  public id = input.required<string>(); // id de la mascota desde la URL
  public animalActual = signal<any>(null); // Guardaremos los datos del animal aquí

  preguntasBase = [
    '¿Cuentas con espacio suficiente y seguro para el animal?',
    '¿Todos los integrantes del hogar están de acuerdo con la adopción?',
    '¿Tienes tiempo diario para paseos, juegos y socialización?',
    '¿Qué harías si el animal se enferma y requiere gastos médicos imprevistos?',
    '¿Conoces el esquema de vacunas y desparasitaciones necesarias?',
  ];

  adopcionForm = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(8)]],
    direccion: ['', [Validators.required, Validators.minLength(10)]],
    motivoAdopcion: ['', [Validators.required, Validators.minLength(20)]],
    respuestasCuestionario: this.fb.array(
      this.preguntasBase.map((_, index) => this.crearPreguntaForm(index + 1)),
    ),
  });

  async ngOnInit() {
    //Al cargar, obtenemos al animal para tener su idRescatista
    try {
      const data = await this.animalService.obtenerPorId(Number(this.id()));
      this.animalActual.set(data);
    } catch (error) {
      //ya lo hace services
      // this.alertService.error('Error', 'No se pudo obtener la información del rescatista.');
    }
  }

  private crearPreguntaForm(id: number): FormGroup {
    return this.fb.group({
      id: [id],
      respuesta: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get cuestionarioArray() {
    return this.adopcionForm.get('respuestasCuestionario') as FormArray;
  }

  async enviarSolicitud() {
    if (this.adopcionForm.valid && this.animalActual()) {
      const rawValues = this.adopcionForm.getRawValue();

      const SolicitudAdopcion = {
        idUser: localStorage.getItem('userId'),
        idMascota: Number(this.id()),
        idRescatista: this.animalActual().idRescatista,

        formulario: {
          nombreCompleto: rawValues.nombreCompleto,
          direccion: rawValues.direccion,
          motivo: rawValues.motivoAdopcion,
          cuestionario: rawValues.respuestasCuestionario.map((item: any, index: number) => {
            return {
              idPregunta: item['id'],
              pregunta: this.preguntasBase[index],
              respuesta: item['respuesta'],
            };
          }),
        },
      };

      try {
        await this.animalService.enviarSolicitudAdopcion(SolicitudAdopcion);
        this.alertService.success(
          '¡Expediente Entregado!',
          'Tu solicitud ha sido enviada. El rescatista se pondrá en contacto contigo pronto.',
        );
        await this.router.navigate(['/']);
      } catch (error) {
        this.alertService.error('Error', 'No se pudo procesar la adopción.');
      }
    } else {
      this.adopcionForm.markAllAsTouched();
    }
  }
}
