import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthFacade } from '../store/auth/auth.facade';

/**
 * authInterceptor
 *
 * 1. Voegt `Authorization: Bearer <token>` toe aan elk uitgaand verzoek.
 * 2. Onderschept 401-responses en probeert automatisch de access-token
 *    te vernieuwen via het refresh-token. Lukt dat, dan wordt het
 *    oorspronkelijke verzoek opnieuw verstuurd. Lukt het niet, dan
 *    wordt de gebruiker uitgelogd.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const authFacade = inject(AuthFacade);

  // Voeg access-token toe als die beschikbaar is
  const token = authFacade.accessToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      // Alleen 401-fouten afhandelen, niet voor auth-endpoints zelf
      if (
        err instanceof HttpErrorResponse &&
        err.status === 401 &&
        !req.url.includes('/auth/refresh') &&
        !req.url.includes('/auth/login')
      ) {
        const refreshToken = authFacade.refreshToken();
        if (refreshToken) {
          return auth.refreshAccessToken(refreshToken).pipe(
            switchMap(res => {
              // Herstuur het originele verzoek met het nieuwe token
              const retried = req.clone({
                setHeaders: { Authorization: `Bearer ${res.accessToken}` },
              });
              return next(retried);
            }),
            catchError(refreshErr => {
              // Refresh mislukt — uitloggen
              auth.logout();
              return throwError(() => refreshErr);
            }),
          );
        } else {
          // Geen refresh-token — uitloggen
          auth.logout();
        }
      }
      return throwError(() => err);
    }),
  );
};
