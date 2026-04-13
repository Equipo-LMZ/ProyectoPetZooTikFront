export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

export interface AlertConfig {
  type: AlertType;
  title: string;
  description: string;
}
