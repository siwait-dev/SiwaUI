import { Injectable, NgZone, OnDestroy, signal, inject } from '@angular/core';
import { Subject } from 'rxjs';
import {
  DEFAULT_IDLE_POLICY,
  IDLE_ACTIVITY_EVENTS,
  MINUTES_TO_MILLISECONDS,
} from '../constants/ui-runtime.constants';

export interface IdlePolicy {
  enabled: boolean;
  userCanDisable: boolean;
  timeoutMinutes: number;
}

@Injectable({ providedIn: 'root' })
export class IdleService implements OnDestroy {
  private readonly zone = inject(NgZone);
  private timer: ReturnType<typeof setTimeout> | null = null;
  private policy: IdlePolicy = { ...DEFAULT_IDLE_POLICY };

  readonly isIdle = signal(false);
  readonly onTimeout = new Subject<void>();

  private readonly events = IDLE_ACTIVITY_EVENTS;
  private readonly boundReset = () => this.reset();

  configure(policy: IdlePolicy): void {
    this.policy = policy;
    if (policy.enabled) {
      this.start();
    } else {
      this.stop();
    }
  }

  setUserTimeout(minutes: number): void {
    if (!this.policy.userCanDisable) return;
    this.policy.timeoutMinutes = minutes;
    this.reset();
  }

  disable(): void {
    if (!this.policy.userCanDisable) return;
    this.stop();
  }

  private start(): void {
    this.events.forEach(e => document.addEventListener(e, this.boundReset, { passive: true }));
    this.reset();
  }

  private stop(): void {
    this.events.forEach(e => document.removeEventListener(e, this.boundReset));
    if (this.timer) clearTimeout(this.timer);
  }

  private reset(): void {
    this.isIdle.set(false);
    if (this.timer) clearTimeout(this.timer);
    this.zone.runOutsideAngular(() => {
      this.timer = setTimeout(() => {
        this.zone.run(() => {
          this.isIdle.set(true);
          this.onTimeout.next();
        });
      }, this.policy.timeoutMinutes * MINUTES_TO_MILLISECONDS);
    });
  }

  ngOnDestroy(): void {
    this.stop();
    this.onTimeout.complete();
  }
}
