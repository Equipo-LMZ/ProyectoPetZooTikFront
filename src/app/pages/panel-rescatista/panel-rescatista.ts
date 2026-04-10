import { Component } from '@angular/core';
import { GestionAnimales } from '../gestion-animales/gestion-animales';

@Component({
  selector: 'app-panel-rescatista',
  imports: [GestionAnimales],
  standalone: true,
  templateUrl: './panel-rescatista.html',
  styleUrl: './panel-rescatista.css',
})
export class PanelRescatista {}
