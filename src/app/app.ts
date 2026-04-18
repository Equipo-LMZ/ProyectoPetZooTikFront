import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { CustomAlert } from './components/custom-alert/custom-alert';
import { FloatingChatComponent } from './components/floating-chat/floating-chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CustomAlert, FloatingChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoPetZooTikFront');
}
