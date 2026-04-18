export interface Peticion {
  id: number;
  userId: number;
  nombre: string;
  fecha: string;
  biografia: string;
  residencia: string;
  imagen: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
  animacionSello: 'none' | 'approve' | 'reject';
  ya_evaluado: boolean;
}