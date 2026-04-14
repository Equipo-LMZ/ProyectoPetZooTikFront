import {
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-not-found-404',
  imports: [],
  standalone: true,
  templateUrl: './not-found-404.html',
  styleUrl: './not-found-404.css',
})
export class NotFound404 {
  private pet = viewChild<ElementRef>('pet');
  private obstacle = viewChild<ElementRef>('obstacle');

  // Señales de estado del juego
  public gameState = signal<'waiting' | 'playing' | 'gameover'>('waiting');
  public score = signal(0);
  public highScore = signal(Number(localStorage.getItem('forestTrailHS')) || 0);
  public isJumping = signal(false);

  constructor() {
    // Iniciamos el loop de colisiones tras el renderizado
    afterNextRender(() => {
      this.gameLoop();
    });
  }

  // Escucha universal de la tecla Espacio (Soluciona el error de compilación anterior)
  @HostListener('window:keydown.space', ['$event'])
  handleSpace(event: Event) {
    event.preventDefault(); // Evitamos el scroll de la página

    // Convertimos el evento genérico a uno de teclado con seguridad
    const keyEvent = event as KeyboardEvent;

    if (this.gameState() === 'playing') {
      this.jump();
    } else {
      this.startGame();
    }
  }

  startGame() {
    console.log('Esto es un Easter Egg, disfrutalo :D');
    this.score.set(0);
    this.gameState.set('playing');
    this.isJumping.set(false);
    this.runScore();
  }

  jump() {
    // Si ya está saltando o el juego terminó, ignorar
    if (this.isJumping() || this.gameState() !== 'playing') return;

    this.isJumping.set(true);
    // El salto dura 700ms en el CSS para un movimiento más suave
    setTimeout(() => {
      this.isJumping.set(false);
    }, 700);
  }

  runScore() {
    if (this.gameState() !== 'playing') return;
    this.score.update((s) => s + 1);
    // Suma puntos más rápido para dar emoción
    setTimeout(() => this.runScore(), 80);
  }

  gameLoop() {
    const check = () => {
      if (this.gameState() === 'playing') {
        const petRect = this.pet()?.nativeElement.getBoundingClientRect();
        const obsRect = this.obstacle()?.nativeElement.getBoundingClientRect();

        // Lógica de colisión con hitbox ajustada (10px de margen)
        if (petRect && obsRect) {
          const margin = 10;
          if (
            petRect.right - margin > obsRect.left &&
            petRect.left + margin < obsRect.right &&
            petRect.bottom - margin > obsRect.top
          ) {
            console.warn('¡El mapache se tropezó!');
            this.gameOver();
          }
        }
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }

  gameOver() {
    this.gameState.set('gameover');
    if (this.score() > this.highScore()) {
      this.highScore.set(this.score());
      localStorage.setItem('forestTrailHS', this.highScore().toString());
    }
  }
}
