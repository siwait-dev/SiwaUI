import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActionTrailService } from './action-trail.service';

export type LogLevel = 'debug' | 'info' | 'warning' | 'error';

export interface ClientLogEntry {
  level: LogLevel;
  message: string;
  stackTrace?: string;
  url: string;
  userAgent: string;
  userId?: string;
  correlationId?: string;
  timestamp: string;
  actionTrail?: string[];
  context?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly http = inject(HttpClient);
  private readonly actionTrail = inject(ActionTrailService);
  private apiUrl = '/api/logs/client';

  configure(apiUrl: string): void {
    this.apiUrl = apiUrl;
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const entry = this.buildEntry('error', message, error, context);
    console.error(message, error);
    this.send(entry);
  }

  warning(message: string, context?: Record<string, unknown>): void {
    const entry = this.buildEntry('warning', message, undefined, context);
    console.warn(message);
    this.send(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.buildEntry('info', message, undefined, context);
    this.send(entry);
  }

  private buildEntry(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: Record<string, unknown>,
  ): ClientLogEntry {
    return {
      level,
      message,
      stackTrace: error instanceof Error ? error.stack : undefined,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      actionTrail: this.actionTrail.getTrail(),
      context,
    };
  }

  private send(entry: ClientLogEntry): void {
    this.http.post(this.apiUrl, entry).subscribe({ error: () => {} });
  }
}
