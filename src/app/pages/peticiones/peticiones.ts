import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Peticion {
  id: number;
  userId: number;
  nombre: string;
  fecha: string;
  biografia: string;
  residencia: string;
  imagen: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
  animacionSello: 'none' | 'approve' | 'reject';
}

@Component({
  selector: 'app-peticiones',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './peticiones.html',
  styleUrl: './peticiones.css',
})
export class Peticiones {
  tabFiltro: 'Pendientes' | 'Aprobadas' | 'Rechazadas' = 'Pendientes';
  indiceActual: number = 0;

  solicitudes: Peticion[] = [
    {
      id: 1,
      userId: 101,
      nombre: 'Mariana López',
      fecha: '2025-04-11',
      biografia: 'Quiero cambiar la vida de más animales comunitarios en mi zona. Llevo 2 años como voluntaria en albergues locales.',
      residencia: 'Monterrey, Nuevo León',
      imagen: 'https://randomuser.me/api/portraits/women/44.jpg',
      estado: 'Pendiente',
      animacionSello: 'none'
    },
    {
      id: 2,
      userId: 205,
      nombre: 'Roberto Gómez',
      fecha: '2025-04-10',
      biografia: 'Tengo un albergue improvisado y busco formalizar las adopciones. Me apasiona darles una segunda oportunidad.',
      residencia: 'Guadalajara, Jalisco',
      imagen: 'https://randomuser.me/api/portraits/men/32.jpg',
      estado: 'Pendiente',
      animacionSello: 'none'
    },
    {
      id: 3,
      userId: 312,
      nombre: 'Carla Ruiz',
      fecha: '2025-04-08',
      biografia: 'Me interesa usar la plataforma para difundir mis casos críticos. Soy veterinaria zootecnista de profesión.',
      residencia: 'CDMX, Ciudad de México',
      imagen: 'https://randomuser.me/api/portraits/women/68.jpg',
      estado: 'Pendiente',
      animacionSello: 'none'
    },
    {
      id: 4,
      userId: 408,
      nombre: 'Eduardo Garza',
      fecha: '2025-04-07',
      biografia: 'Quiero conectar perros rehabilitados con familias amorosas. Trabajo como entrenador canino profesional.',
      residencia: 'Querétaro, Querétaro',
      imagen: 'https://randomuser.me/api/portraits/men/75.jpg',
      estado: 'Pendiente',
      animacionSello: 'none'
    }
  ];

  get solicitudesFiltradas() {
    return this.solicitudes.filter(s => {
      if (this.tabFiltro === 'Pendientes') return s.estado === 'Pendiente';
      if (this.tabFiltro === 'Aprobadas') return s.estado === 'Aprobada';
      if (this.tabFiltro === 'Rechazadas') return s.estado === 'Rechazada';
      return false;
    });
  }

  cambiarTab(tab: 'Pendientes' | 'Aprobadas' | 'Rechazadas') {
    this.tabFiltro = tab;
    this.indiceActual = 0;
  }

  anteriorCarta() {
    if (this.indiceActual > 0) {
      this.indiceActual--;
    }
  }

  siguienteCarta() {
    if (this.indiceActual < this.solicitudesFiltradas.length - 1) {
      this.indiceActual++;
    }
  }

  aprobarPeticion(solicitud: Peticion) {
    if (solicitud.animacionSello !== 'none') return;

    solicitud.animacionSello = 'approve';

    setTimeout(() => {
      solicitud.estado = 'Aprobada';
      solicitud.animacionSello = 'none';
      this.asegurarIndiceValido();
    }, 1200);
  }

  rechazarPeticion(solicitud: Peticion) {
    if (solicitud.animacionSello !== 'none') return;

    solicitud.animacionSello = 'reject';

    setTimeout(() => {
      solicitud.estado = 'Rechazada';
      solicitud.animacionSello = 'none';
      this.asegurarIndiceValido();
    }, 1200);
  }

  private asegurarIndiceValido() {
    if (this.solicitudesFiltradas.length === 0) {
      this.indiceActual = 0;
    } else if (this.indiceActual >= this.solicitudesFiltradas.length) {
      this.indiceActual = this.solicitudesFiltradas.length - 1;
    }
  }
}
