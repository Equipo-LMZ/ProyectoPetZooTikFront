import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private sendAudio    = new Audio('/assets/audios/enviarMensaje.mp3');
  private receiveAudio = new Audio('/assets/audios/recibirMensaje.mp3');
  private catAudio     = new Audio('/assets/audios/meow.mp3');
  private dogAudio     = new Audio('/assets/audios/ladrido.mp3');
  private canaryAudio  = new Audio('/assets/audios/canario.mp3');

  constructor() {
    // Precargamos los audios para evitar delay en la primera reproducción
    this.sendAudio.load();
    this.receiveAudio.load();
    this.catAudio.load();
    this.dogAudio.load();
    this.canaryAudio.load();
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

  playAnimal(animal: 'cat' | 'dog' | 'canary'): void {
    let audio: HTMLAudioElement;
    if (animal === 'cat') audio = this.catAudio;
    else if (animal === 'dog') audio = this.dogAudio;
    else audio = this.canaryAudio;

    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }
}
