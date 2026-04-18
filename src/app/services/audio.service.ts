import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private sendAudio    = new Audio('/assets/audios/enviarMensaje.mp3');
  private receiveAudio = new Audio('/assets/audios/recibirMensaje.mp3');

  constructor() {
    // Precargamos los audios para evitar delay en la primera reproducción
    this.sendAudio.load();
    this.receiveAudio.load();
  }

  playSend(): void {
    this.sendAudio.currentTime = 0;
    this.sendAudio.volume = 0.3;
    this.sendAudio.play().catch(() => {});
  }

  playReceive(): void {
    this.receiveAudio.currentTime = 0;
    this.receiveAudio.volume = 0.3;
    this.receiveAudio.play().catch(() => {});
  }
}
