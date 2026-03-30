import { Injectable } from '@angular/core';
import { ACTION_TRAIL_MAX_ENTRIES } from '../constants/ui-runtime.constants';

interface TrailEntry {
  timestamp: string;
  action: string;
}

@Injectable({ providedIn: 'root' })
export class ActionTrailService {
  private trail: TrailEntry[] = [];

  record(action: string): void {
    this.trail.push({ timestamp: new Date().toISOString(), action });
    if (this.trail.length > ACTION_TRAIL_MAX_ENTRIES) {
      this.trail.shift();
    }
  }

  getTrail(): string[] {
    return this.trail.map(e => `${e.timestamp}  ${e.action}`);
  }

  clear(): void {
    this.trail = [];
  }
}
