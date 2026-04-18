export interface Mensaje {
  id: number;
  texto: string;
  esMio: boolean; // true si lo mandó el rescatista
  hora: string;
  imagen?: string;
}

export interface ChatThread {
  id: string;
  nombreCandidato: string;
  animalId: number;
  animalNombre: string;
  avatar: string;
  mensajes: Mensaje[];
  idAdoptante?: number;
  idRescatista?: number;
  formularios?: any[];
}
