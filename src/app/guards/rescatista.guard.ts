import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { AlertsService } from '../services/alerts-service';

export const rescatistaGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertsService = inject(AlertsService);

  const currentUser = authService.currentUser();

  if (currentUser && currentUser.tipo === 'Rescatista') {
    return true;
  }

  alertsService.error('Acceso denegado', 'Solo los rescatistas pueden acceder al panel.');
  return router.createUrlTree(['/']);
};
