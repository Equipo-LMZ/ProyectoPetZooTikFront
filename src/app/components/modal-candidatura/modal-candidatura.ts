import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-modal-candidatura',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-candidatura.html',
  styleUrl: './modal-candidatura.css',
})
export class ModalCandidatura {
  private fb = inject(FormBuilder);

  // Expresión regular para validar URLs básicas (para redes sociales)
  private urlPattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  postulacionForm = this.fb.group({
    imagen: [null, [Validators.required, this.validarExtensionImagen]],
    biografia: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
    ubicacion: ['', [Validators.required, Validators.minLength(10)]],
    fechaCreacion: [{ value: new Date().toISOString().split('T')[0], disabled: true }],
    experiencia: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
    motivo: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(500)]],
    horario: ['', [Validators.required, Validators.minLength(10)]],
    redesSociales: this.fb.array([]),
  });

  validarExtensionImagen(control: AbstractControl): ValidationErrors | null {
    const archivo = control.value as File;
    if (archivo) {
      const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp'];
      const extension = archivo.name.split('.').pop()?.toLowerCase();
      return extension && extensionesPermitidas.includes(extension)
        ? null
        : { extensionInvalida: true };
    }
    return null;
  }

  // Getter para el FormArray (necesario para el tipado en el template)
  get redesArray() {
    return this.postulacionForm.get('redesSociales') as FormArray;
  }

  agregarRedSocial() {
    // Cada nueva red social debe ser una URL válida
    this.redesArray.push(
      new FormControl('', [Validators.required, Validators.pattern(this.urlPattern)]),
    );
  }
  eliminarRedSocial(index: number) {
    this.redesArray.removeAt(index);
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.postulacionForm.patchValue({ imagen: file });
      this.postulacionForm.get('imagen')?.updateValueAndValidity();
    }
  }

  enviarPostulacion() {
    if (this.postulacionForm.valid) {
      console.log('Datos listos para el POST:', this.postulacionForm.getRawValue());
    }
  }
}
