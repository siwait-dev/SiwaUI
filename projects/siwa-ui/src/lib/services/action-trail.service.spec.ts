import { TestBed } from '@angular/core/testing';
import { ActionTrailService } from './action-trail.service';

describe('ActionTrailService', () => {
  let service: ActionTrailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionTrailService);
  });

  it('should start with empty trail', () => {
    expect(service.getTrail()).toHaveLength(0);
  });

  it('should record an action', () => {
    service.record('Navigeerde naar /dashboard');
    expect(service.getTrail()).toHaveLength(1);
    expect(service.getTrail()[0]).toContain('Navigeerde naar /dashboard');
  });

  it('should record multiple actions in order', () => {
    service.record('actie 1');
    service.record('actie 2');
    service.record('actie 3');
    const trail = service.getTrail();
    expect(trail).toHaveLength(3);
    expect(trail[0]).toContain('actie 1');
    expect(trail[2]).toContain('actie 3');
  });

  it('should include timestamp in trail entries', () => {
    service.record('test actie');
    const entry = service.getTrail()[0];
    expect(entry).toMatch(/\d{4}-\d{2}-\d{2}T/); // ISO timestamp
  });

  it('should cap trail at 50 entries', () => {
    for (let i = 0; i < 60; i++) {
      service.record(`actie ${i}`);
    }
    expect(service.getTrail()).toHaveLength(50);
  });

  it('should drop oldest entries when over 50', () => {
    for (let i = 0; i < 55; i++) {
      service.record(`actie ${i}`);
    }
    const trail = service.getTrail();
    expect(trail[0]).toContain('actie 5'); // eerste 5 zijn weg
  });

  it('should clear trail', () => {
    service.record('actie 1');
    service.record('actie 2');
    service.clear();
    expect(service.getTrail()).toHaveLength(0);
  });
});
