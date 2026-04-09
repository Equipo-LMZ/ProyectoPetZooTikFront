import { Routes } from '@angular/router';

export const routes: Routes = [
  // Rutas Públicas
  { 
    path: '', 
    loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) 
  },
  { 
    path: 'mascotas', 
    loadComponent: () => import('./pages/mascotas/mascotas').then(m => m.Mascotas) 
  },
  { 
    path: 'detalle-mascota/:id', 
    loadComponent: () => import('./pages/detalle-mascota/detalle-mascota').then(m => m.DetalleMascota) 
  },
  { 
    path: 'mapa', 
    loadComponent: () => import('./pages/mapa/mapa').then(m => m.Mapa) 
  },

  // Rutas Privadas (Panel del Rescatista)
  {
    path: 'panel',
    loadComponent: () => import('./pages/panel-rescatista/panel-rescatista').then(m => m.PanelRescatista),
    children: [
      { 
        path: 'crud', 
        loadComponent: () => import('./pages/gestion-animales/gestion-animales').then(m => m.GestionAnimales) 
      },
      { 
        path: 'chats', 
        loadComponent: () => import('./pages/chat/chat').then(m => m.Chat) 
      },
      { 
        path: 'peticiones', 
        loadComponent: () => import('./pages/peticiones/peticiones').then(m => m.Peticiones) 
      },
      { path: '', redirectTo: 'crud', pathMatch: 'full' }
    ]
  },

  // Ruta 404
  { 
    path: '**', 
    loadComponent: () => import('./pages/not-found-404/not-found-404').then(m => m.NotFound404) 
  }
];