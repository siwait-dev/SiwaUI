import { TestBed } from '@angular/core/testing';
import { OnlineService } from './online.service';

describe('OnlineService', () => {
  let service: OnlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineService);
  });

  it('should reflect navigator.onLine on init', () => {
    expect(service.isOnline()).toBe(navigator.onLine);
  });

  it('should set isOnline to false on offline event', () => {
    window.dispatchEvent(new Event('offline'));
    expect(service.isOnline()).toBe(false);
  });

  it('should set isOnline to true on online event', () => {
    window.dispatchEvent(new Event('offline'));
    window.dispatchEvent(new Event('online'));
    expect(service.isOnline()).toBe(true);
  });

  it('should execute action immediately when online', () => {
    window.dispatchEvent(new Event('online'));
    let executed = false;
    service.execute(() => (executed = true));
    expect(executed).toBe(true);
  });

  it('should buffer action when offline', () => {
    window.dispatchEvent(new Event('offline'));
    let executed = false;
    service.execute(() => (executed = true));
    expect(executed).toBe(false);
  });

  it('should flush buffer when coming back online', () => {
    window.dispatchEvent(new Event('offline'));
    let executed = false;
    service.execute(() => (executed = true));
    window.dispatchEvent(new Event('online'));
    expect(executed).toBe(true);
  });
});
