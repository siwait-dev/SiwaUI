import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../store/auth/auth.facade';

/**
 * AuthGuard — beschermt alle `/app/**` routes.
 * Redirect naar `/login` als de gebruiker niet is ingelogd.
 */
export interface RouteAccessData {
  requiredRoles?: string[];
}

function getAccessData(route: ActivatedRouteSnapshot): RouteAccessData {
  return (route.data ?? {}) as RouteAccessData;
}

export const authGuard: CanActivateFn = route => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const requiredRoles = getAccessData(route).requiredRoles ?? [];
  if (requiredRoles.length === 0) {
    return true;
  }

  const userRoles = auth.currentUserRoles();
  return requiredRoles.some(role => userRoles.includes(role))
    ? true
    : router.createUrlTree(['/errors/403']);
};
