import { TestBed } from '@angular/core/testing';
import { IdleService, IdlePolicy } from './idle.service';
import { vi } from 'vitest';

describe('IdleService', () => {
  let service: IdleService;

  const enabledPolicy: IdlePolicy = {
    enabled: true,
    userCanDisable: true,
    timeoutMinutes: 1,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdleService);
  });

  afterEach(() => {
    service.ngOnDestroy();
    vi.useRealTimers();
  });

  it('should start not idle', () => {
    expect(service.isIdle()).toBe(false);
  });

  it('should become idle after timeout', () => {
    service.configure(enabledPolicy);
    vi.advanceTimersByTime(60 * 1000 + 100);
    expect(service.isIdle()).toBe(true);
  });

  it('should reset when user moves mouse before timeout', () => {
    service.configure(enabledPolicy);
    vi.advanceTimersByTime(30 * 1000);
    document.dispatchEvent(new MouseEvent('mousemove'));
    vi.advanceTimersByTime(30 * 1000);
    expect(service.isIdle()).toBe(false);
  });

  it('should not allow disable when userCanDisable is false', () => {
    const lockedPolicy: IdlePolicy = { enabled: true, userCanDisable: false, timeoutMinutes: 5 };
    service.configure(lockedPolicy);
    service.disable();
    vi.advanceTimersByTime(5 * 60 * 1000 + 100);
    expect(service.isIdle()).toBe(true); // nog steeds actief
  });

  it('should allow disable when userCanDisable is true', () => {
    service.configure(enabledPolicy);
    service.disable();
    vi.advanceTimersByTime(60 * 1000 + 100);
    expect(service.isIdle()).toBe(false);
  });

  it('should emit onTimeout when idle', () => {
    let timedOut = false;
    service.onTimeout.subscribe(() => (timedOut = true));
    service.configure(enabledPolicy);
    vi.advanceTimersByTime(60 * 1000 + 100);
    expect(timedOut).toBe(true);
  });
});
