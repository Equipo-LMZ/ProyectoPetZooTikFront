import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { CustomAlert } from './components/custom-alert/custom-alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CustomAlert],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoPetZooTikFront');
}
