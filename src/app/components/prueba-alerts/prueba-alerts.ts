import { Component, inject } from '@angular/core';
import { AlertsService } from '../../services/alerts-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prueba-alerts',
  imports: [CommonModule],
  templateUrl: './prueba-alerts.html',
  styleUrl: './prueba-alerts.css',
})
export class PruebaAlerts {
  private alertService = inject(AlertsService);

  testSuccess() {
    this.alertService.success(
      '¡Trámite Aprobado!',
      'El sello de autenticidad ha sido aplicado. La mascota ahora cuenta con su documentación oficial de la Gaceta.',
    );
  }

  testError() {
    this.alertService.error(
      '¡Envío Rechazado!',
      'La tinta se ha corrido o el formulario está incompleto. El mensajero no puede entregar este documento.',
    );
  }

  testWarning() {
    this.alertService.warning(
      '¡Aviso de Urgencia!',
      'Se ha detectado una anomalía en el registro. Se recomienda verificar los sellos antes de proceder con el archivo.',
    );
  }

  testInfo() {
    this.alertService.info(
      'Boletín Informativo',
      'Nuevas vacantes para rescatistas han sido publicadas en la sección clasificados de la edición vespertina.',
    );
  }

  testQuestion() {
    this.alertService.question(
      '¿Confirmar Despacho?',
      '¿Está seguro de querer enviar esta carta al departamento de adopciones? Esta acción no puede deshacerse.',
    );
  }
}
