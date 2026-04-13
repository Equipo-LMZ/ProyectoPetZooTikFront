export interface Mensaje {
  id: number;
  texto: string;
  esMio: boolean; // true si lo mandó el rescatista
  hora: string;
}

export interface ChatThread {
  id: number;
  nombreCandidato: string;
  animalId: number;
  animalNombre: string;
  avatar: string;
  mensajes: Mensaje[];
  noLeidos: number;
}
