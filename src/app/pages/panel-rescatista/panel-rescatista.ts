import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel-rescatista',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './panel-rescatista.html',
  styleUrl: './panel-rescatista.css',
})
export class PanelRescatista {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }
}
