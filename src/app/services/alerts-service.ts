import { Injectable, signal } from '@angular/core';
import { AlertConfig } from '../interfaces/alert-config';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  /**
   * Signal que almacena la configuración de la alerta actual.
   * Si es null, la alerta no es visible.
   */
  public currentAlert = signal<AlertConfig | null>(null);

  /**
   * Muestra una alerta del tipo especificado.
   */
  public showAlert(config: AlertConfig): void {
    this.currentAlert.set(config);
  }

  /**
   * Oculta la alerta actual.
   */
  public closeAlert(): void {
    this.currentAlert.set(null);
  }

  public success(title: string, description: string): void {
    this.showAlert({ type: 'success', title, description });
  }

  public error(title: string, description: string): void {
    this.showAlert({ type: 'error', title, description });
  }

  public warning(title: string, description: string): void {
    this.showAlert({ type: 'warning', title, description });
  }

  public info(title: string, description: string): void {
    this.showAlert({ type: 'info', title, description });
  }

  public question(title: string, description: string): void {
    this.showAlert({ type: 'question', title, description });
  }
}
