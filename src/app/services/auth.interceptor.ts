import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth'; // ⚠️ Ajusta la ruta según dónde guardes el archivo
import { AlertsService } from '../services/alerts-service'; // ⚠️ Ajusta la ruta

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const alertsService = inject(AlertsService);

  // Dejamos pasar la petición y analizamos la respuesta
  return next(req).pipe(
    catchError((error) => {
      //Si el backend rechaza por Token caducado
      if (error.status === 401) {
        alertsService.error('Sesión Expirada', 'Por seguridad, tu sesión ha caducado. Vuelve a iniciar sesión.');
        authService.logout(); // Te manda al inicio y limpia datos
      }
      
      // Dejamos que el error siga su camino por si el componente quiere hacer algo extra
      return throwError(() => error);
    })
  );
};