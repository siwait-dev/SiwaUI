import { Injectable } from '@angular/core';

interface TrailEntry {
  timestamp: string;
  action: string;
}

@Injectable({ providedIn: 'root' })
export class ActionTrailService {
  private readonly MAX_ENTRIES = 50;
  private trail: TrailEntry[] = [];

  record(action: string): void {
    this.trail.push({ timestamp: new Date().toISOString(), action });
    if (this.trail.length > this.MAX_ENTRIES) {
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
