import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RescatistaService } from '../../services/rescatista-service';
import { AlertsService } from '../../services/alerts-service';
import { Peticion } from '../../interfaces/peticion-interface';

@Component({
  selector: 'app-peticiones',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './peticiones.html',
  styleUrl: './peticiones.css',
})

export class Peticiones implements OnInit {
  private rescatistaService = inject(RescatistaService);
  private alertsService = inject(AlertsService);

  private cdr = inject(ChangeDetectorRef);

  tabFiltro: 'Pendientes' | 'Aprobadas' | 'Rechazadas' = 'Pendientes';
  indiceActual: number = 0;
  cargando: boolean = false;

  solicitudes: Peticion[] = [];

  ngOnInit() {
    this.cargarPeticiones();
  }

  async cargarPeticiones() {
    this.cargando = true;
    try {
      const [resP, resA, resR] = await Promise.all([
        this.rescatistaService.obtenerPeticiones('p'),
        this.rescatistaService.obtenerPeticiones('a'),
        this.rescatistaService.obtenerPeticiones('r')
      ]);
      
      const todaLaData = [
        ...(resP.candidacies || []),
        ...(resA.candidacies || []),
        ...(resR.candidacies || [])
      ];
      
      this.solicitudes = todaLaData.map((item: any) => {
        let estadoF: 'Pendiente' | 'Aprobada' | 'Rechazada' = 'Pendiente';
        if (item.status === 'a' || item.status === 'A') estadoF = 'Aprobada';
        if (item.status === 'r' || item.status === 'R') estadoF = 'Rechazada';

        let urlImagen = 'assets/ui/default-avatar.png';
        if (item.imagen) {
           urlImagen = item.imagen.startsWith('http') ? item.imagen : `https://api.petzootik.site${item.imagen}`;
        }

        return {
          id: item.idCandidatura || item.id,
          userId: item.idUsuario || item.userId,
          nombre: item.nombre || `Aspirante #${item.idUsuario || item.userId}`,
          fecha: item.fechaCreacion ? new Date(item.fechaCreacion).toLocaleDateString() : 'Sin fecha',
          biografia: item.biografia || 'Sin carta de motivos.',
          residencia: item.residencia || 'No especificada',
          imagen: urlImagen,
          estado: estadoF,
          animacionSello: 'none',
          ya_evaluado: !!item.ya_evaluado
        };
      });

      this.cdr.detectChanges();
    } catch (error) {
      this.alertsService.error('Error de conexión', 'No se pudieron cargar las postulaciones.');
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

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

  async aprobarPeticion(solicitud: Peticion) {
    if (solicitud.animacionSello !== 'none' || solicitud.ya_evaluado) return;

    try {
      await this.rescatistaService.responderPeticion(solicitud.id, true);
      
      solicitud.animacionSello = 'approve';
      solicitud.ya_evaluado = true;

      setTimeout(() => {
        solicitud.estado = 'Aprobada';
        solicitud.animacionSello = 'none';
        
        this.solicitudes = [...this.solicitudes];
        
        this.asegurarIndiceValido();
        this.cdr.detectChanges(); 
        
        this.alertsService.success('Aprobado', 'Voto a favor registrado.');
      }, 1200);

    } catch (error) {
      this.alertsService.error('Error', 'No se pudo aprobar la postulación.');
      solicitud.animacionSello = 'none';
      solicitud.ya_evaluado = false;
    }
  }

  async rechazarPeticion(solicitud: Peticion) {
   if (solicitud.animacionSello !== 'none' || solicitud.ya_evaluado) return;

    try {
      await this.rescatistaService.responderPeticion(solicitud.id, false);

      solicitud.animacionSello = 'reject';
      solicitud.ya_evaluado = true;

      setTimeout(() => {
        solicitud.estado = 'Rechazada';
        solicitud.animacionSello = 'none';
        
        this.solicitudes = [...this.solicitudes];

        this.asegurarIndiceValido();
        this.cdr.detectChanges();
      }, 1200);

    } catch (error) {
      this.alertsService.error('Error', 'Hubo un problema al rechazar la postulación.');
      solicitud.animacionSello = 'none';
      solicitud.ya_evaluado = false;
    }
  }

  private asegurarIndiceValido() {
    if (this.solicitudesFiltradas.length === 0) {
      this.indiceActual = 0;
    } else if (this.indiceActual >= this.solicitudesFiltradas.length) {
      this.indiceActual = this.solicitudesFiltradas.length - 1;
    }
  }
}
