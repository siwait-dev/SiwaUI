import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  readonly isConnected = signal(false);
  readonly notification$ = new Subject<unknown>();

  async connect(hubUrl: string, tokenFactory: () => string): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: tokenFactory })
      .withAutomaticReconnect()
      .build();

    this.connection.onreconnected(() => this.isConnected.set(true));
    this.connection.onreconnecting(() => this.isConnected.set(false));
    this.connection.onclose(() => this.isConnected.set(false));

    this.connection.on('ReceiveNotification', (payload: unknown) => {
      this.notification$.next(payload);
    });

    await this.connection.start();
    this.isConnected.set(true);
  }

  async disconnect(): Promise<void> {
    await this.connection?.stop();
    this.isConnected.set(false);
  }
}
