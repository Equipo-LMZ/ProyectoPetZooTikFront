import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-adoptar',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './adoptar.html',
  styleUrl: './adoptar.css',
})
export class Adoptar {
  private fb = inject(FormBuilder);

  // Listado de preguntas (el ID es el índice + 1)
  preguntasBase = [
    '¿Cuentas con espacio suficiente y seguro para el animal?',
    '¿Todos los integrantes del hogar están de acuerdo con la adopción?',
    '¿Tienes tiempo diario para paseos, juegos y socialización?',
    '¿Qué harías si el animal se enferma y requiere gastos médicos imprevistos?',
    '¿Quién se hará cargo del animalito si sales de viaje o vacaciones?',
    '¿Has tenido mascotas antes? ¿Qué pasó con ellas?',
    '¿Conoces el esquema de vacunas y desparasitaciones necesarias?',
    '¿Estás de acuerdo con la esterilización obligatoria del animal?',
    '¿Qué harías si el animal rompe algún objeto o mueble en casa?',
    '¿Aceptas que el refugio realice visitas de seguimiento periódicas?',
  ];

  adopcionForm = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(8)]],
    direccion: ['', [Validators.required, Validators.minLength(10)]],
    motivoAdopcion: ['', [Validators.required, Validators.minLength(20)]],

    // Aquí vive la lista de objetos { id, respuesta }
    respuestasCuestionario: this.fb.array(
      this.preguntasBase.map((_, index) => this.crearPreguntaForm(index + 1)),
    ),
  });

  // Crea un grupo para el backend
  private crearPreguntaForm(id: number): FormGroup {
    return this.fb.group({
      id: [id], // La columna ID
      respuesta: ['', [Validators.required, Validators.minLength(5)]], // La columna Respuesta
    });
  }

  // Getter para iterar en el HTML
  get cuestionarioArray() {
    return this.adopcionForm.get('respuestasCuestionario') as FormArray;
  }

  enviarSolicitud() {
    if (this.adopcionForm.valid) {
      // El objeto final ya viene con la estructura:
      // { nombre:..., respuestasCuestionario: [ {id: 1, respuesta: '...'}, {id: 2, respuesta: '...'} ] }
      const payload = this.adopcionForm.getRawValue();
      console.log('JSON listo para el Backend:', payload);

      // Aquí harías tu POST
    }
  }
}
