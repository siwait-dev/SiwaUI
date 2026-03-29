import { Injectable } from '@angular/core';

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
  status?: number;
  error?: {
    hasError?: boolean;
    errors?: ApiErrorMessage[];
  };
  errors?: ApiErrorMessage[];
}

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  getMessageKey(error: unknown, fallbackKey = 'API_ERRORS.UNKNOWN_ERROR'): string {
    const primaryError = this.getPrimaryError(error);

    if (primaryError?.message?.trim()) {
      return primaryError.message.trim();
    }

    if (primaryError?.code?.trim()) {
      return primaryError.code.trim();
    }

    const status = primaryError?.statusCode ?? this.getPayload(error)?.status;
    if (status) {
      return `API_ERRORS.HTTP_${status}`;
    }

    return fallbackKey;
  }

  private getPayload(error: unknown): ApiErrorPayload | null {
    if (!error || typeof error !== 'object') return null;
    return error as ApiErrorPayload;
  }

  private getPrimaryError(error: unknown): ApiErrorMessage | null {
    const payload = this.getPayload(error);
    if (!payload) return null;

    if (payload.error && Array.isArray(payload.error.errors) && payload.error.errors.length > 0) {
      return payload.error.errors[0] ?? null;
    }

    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
      return payload.errors[0] ?? null;
    }

    return payload.code || payload.message ? payload : null;
  }
}
