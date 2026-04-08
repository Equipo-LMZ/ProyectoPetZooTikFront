import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Mascotas } from './pages/mascotas/mascotas';
import { DetalleMascota } from './pages/detalle-mascota/detalle-mascota';
import { Mapa } from './pages/mapa/mapa';
import { PanelRescatista } from './pages/panel-rescatista/panel-rescatista';
import { GestionAnimales } from './pages/gestion-animales/gestion-animales';
import { Chat } from './pages/chat/chat';
import { Peticiones } from './pages/peticiones/peticiones';
import { NotFound404 } from './pages/not-found-404/not-found-404';

// RUTAS
export const routes: Routes = [
  // Rutas Publicas
  { path: '', component: Inicio },
  { path: 'mascotas', component: Mascotas },
  { path: 'detalle-mascota/:id', component: DetalleMascota },
  { path: 'mapa', component: Mapa },

  // Rutas Privadas (Panel del Rescatista)
  {
    path: 'panel',
    component: PanelRescatista,
    children: [
      { path: 'crud', component: GestionAnimales },
      { path: 'chats', component: Chat },
      { path: 'peticiones', component: Peticiones },
      { path: '', redirectTo: 'crud', pathMatch: 'full' }
    ]
  },

  // Ruta 404
  { path: '**', component: NotFound404 }
];