import { inject, Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface SignalRMessage {
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class SignalRService implements OnDestroy {
  private readonly auth = inject(AuthService);

  private connection: signalR.HubConnection | null = null;
  private readonly _messages$ = new Subject<SignalRMessage>();

  /** Observable stream van alle inkomende SignalR berichten. */
  readonly messages$ = this._messages$.asObservable();

  /** Verbinding maken met de NotificationHub. */
  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) return;

    const token = this.auth.getAccessToken();
    const hubUrl = `${environment.apiUrl.replace('/api', '')}/hubs/notifications`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token ?? '',
      })
      .withAutomaticReconnect()
      .build();

    // Forward alle ontvangen berichten naar de Subject
    this.connection.onreconnected(() => {
      this._messages$.next({ method: 'Reconnected', payload: null });
    });

    await this.connection.start();
  }

  /** Luisteren naar een specifiek SignalR event. */
  on(method: string, callback: (payload: unknown) => void): void {
    this.connection?.on(method, callback);
  }

  /** Stoppen met luisteren naar een specifiek SignalR event. */
  off(method: string): void {
    this.connection?.off(method);
  }

  /** Verbinding verbreken. */
  async disconnect(): Promise<void> {
    await this.connection?.stop();
    this.connection = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
