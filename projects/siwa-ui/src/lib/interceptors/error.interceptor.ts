import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoggingService } from '../services/logging.service';

interface ApiErrorMessage {
  code?: string;
  message?: string;
  technicalMessage?: string;
  statusCode?: number;
  type?: string;
}

interface ApiErrorPayload {
  code?: string;
  message?: string;
  error?: {
    hasError?: boolean;
    errors?: ApiErrorMessage[];
  };
  errors?: ApiErrorMessage[];
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const logger = inject(LoggingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.url.includes('/logs/client')) {
        return throwError(() => error);
      }

      const apiError = (error.error ?? null) as ApiErrorPayload | null;
      const primaryError: ApiErrorMessage | null =
        apiError?.error && Array.isArray(apiError.error.errors) && apiError.error.errors.length > 0
          ? apiError.error.errors[0]
          : apiError && Array.isArray(apiError.errors) && apiError.errors.length > 0
            ? apiError.errors[0]
            : (apiError as ApiErrorMessage | null);
      const message = primaryError?.message ?? apiError?.message ?? error.message;
      const code = primaryError?.code ?? apiError?.code ?? 'UNKNOWN_ERROR';
      const correlationId = error.headers.get('X-Correlation-ID') ?? undefined;

      logger.error(`[HTTP ${error.status}] ${code}: ${message}`, error, {
        correlationId,
        method: req.method,
        requestUrl: req.urlWithParams,
        status: primaryError?.statusCode ?? error.status,
      });

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

      return throwError(() => ({
        code,
        message,
        status: primaryError?.statusCode ?? error.status,
        correlationId,
        errors: apiError?.error?.errors ?? apiError?.errors,
      }));
    }),
  );
};
