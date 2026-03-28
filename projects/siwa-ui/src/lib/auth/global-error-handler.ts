import { ErrorHandler, inject, Injectable } from '@angular/core';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggingService);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.logger.error(`[Unhandled Error] ${message}`, error);
  }
}
