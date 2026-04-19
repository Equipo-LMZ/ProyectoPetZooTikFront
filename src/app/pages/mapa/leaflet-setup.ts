import * as L from 'leaflet';

// Esto es un parche crítico para Angular con esbuild.
// Expone L de manera global ANTES de que los plugins de Leaflet se evalúen.
(window as any).L = L;
