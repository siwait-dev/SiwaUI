import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoggingService } from '../services/logging.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const logger = inject(LoggingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.url.includes('/logs/client')) {
        return throwError(() => error);
      }

      const apiError = error.error;
      const message = apiError?.message ?? error.message;
      const code = apiError?.code ?? 'UNKNOWN_ERROR';
      const correlationId = error.headers.get('X-Correlation-ID') ?? undefined;

      logger.error(`[HTTP ${error.status}] ${code}: ${message}`, error, { correlationId });

      switch (error.status) {
        case 401:
          // Sla redirect over voor auth-endpoints (bijv. verkeerd wachtwoord):
          // de component toont dan zelf de foutmelding.
          if (!req.url.includes('/auth/')) {
            void router.navigate(['/login']);
          }
          break;
        case 403:
          router.navigate(['/errors/403']);
          break;
        case 500:
          router.navigate(['/errors/500']);
          break;
      }

      return throwError(() => ({ code, message, status: error.status, correlationId }));
    }),
  );
};
