import { Component, signal, afterNextRender, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements OnInit, OnDestroy {
  /**Referencia principal a la instancia del mapa de Leaflet. */
  private mapaInstancia!: L.Map;

  /**Estado de carga de la interfaz para la sincronización de datos */
  public cargando = signal<boolean>(true);
  private readonly coordenadasPorDefecto: [number, number] = [21.8823, -102.2826];

  constructor() {
    /**
     * Inicializa la lógica una vez que el componente se ha renderizado en el cliente.
     * Evita errores de acceso al DOM durante el Server-Side Rendering (SSR).
     */
    afterNextRender(() => {
      this.geoInit();
    });
  }

  /** Solicita el acceso a la geolocalización del dispositivo del usuario. */
  private geoInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          this.initMap(posicion.coords.latitude, posicion.coords.longitude);
        },
        (error) => {
          console.warn('Acceso a geolocalización denegado. Utilizando coordenadas de respaldo.');
          this.initMap(...this.coordenadasPorDefecto);
        },
      );
    } else {
      this.initMap(...this.coordenadasPorDefecto);
    }
  }

  /** Configura e instancia el lienzo del mapa y sus capas base. */
  private initMap(latitud: number, longitud: number): void {
    this.mapaInstancia = L.map('map', {
      center: [latitud, longitud],
      zoom: 11,
      zoomControl: false,
    });

    // Capa de mosaico: CartoDB Voyager
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.mapaInstancia);

    L.control.zoom({ position: 'bottomright' }).addTo(this.mapaInstancia);

    this.fetchVets(latitud, longitud);
  }

  /* Realiza una petición a la API Overpass para localizar servicios veterinarios */
  /* Realiza una petición a la API Overpass con sistema de redundancia. */
  private async fetchVets(lat: number, lng: number): Promise<void> {
    const radioBusqueda = 20000; // 20 km
    const queryOverpass = `[out:json][timeout:25];node["amenity"="veterinary"](around:${radioBusqueda},${lat},${lng});out;`;

    // Lista de mirrors, sirve para tener servidores en caso de que alguno nos niegue la conexión, podamos conetctarnos a otra api
    const mirrors = [
      `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(queryOverpass)}`,
      `https://lz4.overpass-api.de/api/interpreter?data=${encodeURIComponent(queryOverpass)}`,
      `https://overpass.openstreetmap.ru/cgi/interpreter?data=${encodeURIComponent(queryOverpass)}`,
    ];

    let exito = false;

    for (const url of mirrors) {
      if (exito) break;

      try {
        console.log(`Intentando conectar con: ${url.split('/')[2]}`);
        const respuesta = await fetch(url);

        if (!respuesta.ok) throw new Error(`Status: ${respuesta.status}`);

        const datos = await respuesta.json();

        if (datos.elements && datos.elements.length > 0) {
          datos.elements.forEach((elemento: any) => {
            this.renderMarker(
              elemento.lat,
              elemento.lon,
              elemento.tags.name || 'Establecimiento Veterinario',
            );
          });
          exito = true;
        }
      } catch (error) {
        console.warn(`Servidor ${url.split('/')[2]} falló. Intentando con el siguiente...`);
      }
    }

    if (!exito) {
      console.error(
        'Todos los servidores de Overpass fallaron. Intenta reducir el radio o espera un momento.',
      );
    }

    this.cargando.set(false);
  }

  /** Genera y posiciona un marcador con el link de Google Maps */
  private renderMarker(latitud: number, longitud: number, etiqueta: string): void {
    const estructuraIcono = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="fill: #14b8a6; stroke: white; stroke-width: 25px;">
        <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3c-18.9-32.4-14.3-70.1 10.2-84.1s59.7 .9 78.5 33.3zM411.6 198.6c18.9-32.4 54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3s-29.1-51.7-10.2-84.1zM318.1 92.9c14.3-42.9 52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5s-46.9-53.9-32.6-96.8zM153.2 246.3c-13.6 5-32.6 17.2-32.6 44.1c0 23 18.2 39.5 28.6 47.1c32.6 23.8 69.2 33.8 106.8 33.8c37.5 0 74.2-9.9 106.8-33.8c10.4-7.6 28.6-24.1 28.6-47.1c0-26.9-19-39.1-32.6-44.1c-13.1-4.8-29.6-7-49.4-7c-25.7 0-51.5 6.9-74.1 16.9c-22.6-10-48.3-16.9-74.1-16.9c-19.8 0-36.2 2.1-49.4 7z"/>
      </svg>
    `;

    const iconoPersonalizado = L.divIcon({
      className: 'game-marker',
      html: estructuraIcono,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    // Search API de Google Maps para redirigir a su página
    const query = encodeURIComponent(`${etiqueta} ${latitud},${longitud}`);
    const urlGoogleMaps = `https://www.google.com/maps/search/?api=1&query=${query}`;

    L.marker([latitud, longitud], { icon: iconoPersonalizado }).addTo(this.mapaInstancia)
      .bindPopup(`
        <div style="text-align: center; font-family: 'Trebuchet MS', sans-serif; padding: 5px;">
          <strong style="color: #0f766e; display: block; margin-bottom: 8px;">${etiqueta}</strong>
          <a href="${urlGoogleMaps}" target="_blank" rel="noopener noreferrer" 
             style="
              display: inline-block;
              background-color: #14b8a6;
              color: white;
              padding: 8px 12px;
              text-decoration: none;
              font-weight: bold;
              border-radius: 8px;
              font-size: 0.9em;
              box-shadow: 0 4px 0 #0f766e;
              transition: transform 0.1s;
             "
             onmouseover="this.style.backgroundColor='#0d9488'"
             onmouseout="this.style.backgroundColor='#14b8a6'"
             onmousedown="this.style.transform='translateY(2px)'; this.style.boxShadow='0 2px 0 #0f766e'"
             onmouseup="this.style.transform='translateY(0px)'; this.style.boxShadow='0 4px 0 #0f766e'">
             VER EN GOOGLE MAPS 📍
          </a>
        </div>
      `);
  }

  //Función para mensajes dinámicos en el html

  readonly avisos: string[] = [
    'Coloque al animal en un transportín cerrado y ventilado para evitar movimientos bruscos que puedan agravar sus lesiones durante el trayecto.',
    'No administre ningún medicamento, analgésico ni alimento al animal antes de la consulta, a menos que un veterinario lo haya indicado expresamente.',
    'Monitoree de forma continua la respiración y el nivel de conciencia del animal durante el traslado; detenga el vehículo si detecta cambios críticos en su estado.',
    'Cubra al animal con una manta ligera para mantener estable su temperatura corporal, especialmente ante situaciones de trauma o pérdida de sangre.',
    'Contacte con anticipación a la clínica veterinaria para informar la situación clínica del animal y recibir instrucciones precisas antes de iniciar el traslado.',
  ];

  avisoActualIndex = signal(0);
  avisoVisible = signal(true);

  avisoActual = computed(() => this.avisos[this.avisoActualIndex()]);

  private intervaloAviso: ReturnType<typeof setInterval> | null = null;
  private timeoutTransicion: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.intervaloAviso = setInterval(() => {
      // Fade out
      this.avisoVisible.set(false);

      this.timeoutTransicion = setTimeout(() => {
        this.avisoActualIndex.update((i) => (i + 1) % this.avisos.length);
        // Fade in
        this.avisoVisible.set(true);
      }, 600);
    }, 6000);
  }

  ngOnDestroy(): void {
    if (this.intervaloAviso) clearInterval(this.intervaloAviso);
    if (this.timeoutTransicion) clearTimeout(this.timeoutTransicion);
  }
}
