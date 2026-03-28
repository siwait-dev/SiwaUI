import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OnlineService {
  readonly isOnline = signal(navigator.onLine);
  private readonly buffer: Array<() => void> = [];

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      this.flushBuffer();
    });
    window.addEventListener('offline', () => {
      this.isOnline.set(false);
    });
  }

  // Voer actie uit zodra online — buffer als offline
  execute(action: () => void): void {
    if (this.isOnline()) {
      action();
    } else {
      this.buffer.push(action);
    }
  }

  private flushBuffer(): void {
    while (this.buffer.length > 0) {
      const action = this.buffer.shift();
      action?.();
    }
  }
}
