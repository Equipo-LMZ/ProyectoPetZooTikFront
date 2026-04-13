import { Component, computed, inject } from '@angular/core';
import { AlertsService } from '../../services/alerts-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-alert.html',
  styleUrl: './custom-alert.css',
})
export class CustomAlert {
  // Inyectamos el servicio
  public alertService = inject(AlertsService);

  // Computed signal para saber si la alerta es visible
  public alertVisible = computed(() => this.alertService.currentAlert() !== null);
  public alertConfig = computed(() => this.alertService.currentAlert());

  constructor() {}

  /* Cierra la alerta y ejecuta la animación de salida */
  public close(): void {
    this.alertService.closeAlert();
  }
}
