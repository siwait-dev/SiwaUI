import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuditLogComponent } from './audit-log.component';
import { ApiService } from '../../../core/services/api.service';
import { AuditLogEffects } from '../../../core/store/audit-log/audit-log.effects';
import { auditLogFeature } from '../../../core/store/audit-log/audit-log.reducer';

describe('AuditLogComponent', () => {
  const api = {
    get: vi.fn(),
  };

  const auditResponse = {
    items: [
      {
        id: 1,
        timestamp: '2026-03-29T12:00:00Z',
        method: 'GET',
        path: '/users',
        email: 'admin@example.com',
        ipAddress: '127.0.0.1',
        statusCode: 200,
        durationMs: 15,
      },
    ],
    totalCount: 1,
    page: 1,
    pageSize: 50,
  };

  beforeEach(async () => {
    api.get.mockReset();
    api.get.mockReturnValue(of(auditResponse));

    await TestBed.configureTestingModule({
      imports: [AuditLogComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(auditLogFeature),
        provideEffects(AuditLogEffects),
        { provide: ApiService, useValue: api },
      ],
    }).compileComponents();
  });

  it('loads audit logs on init', async () => {
    const fixture = TestBed.createComponent(AuditLogComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(api.get).toHaveBeenCalledWith('audit', { page: 1, pageSize: 50 });
    expect(fixture.componentInstance['logs']()).toHaveLength(1);
  });

  it('reloads with path filter', async () => {
    const fixture = TestBed.createComponent(AuditLogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    api.get.mockClear();
    component['filterPath'] = '/roles';

    component['reload']();
    await fixture.whenStable();

    expect(api.get).toHaveBeenCalledWith('audit', { page: 1, pageSize: 50, path: '/roles' });
  });

  it('clears filters and reloads the first page', async () => {
    const fixture = TestBed.createComponent(AuditLogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    api.get.mockClear();
    component['selectedMethod'] = 'POST';
    component['filterEmail'] = 'admin@example.com';
    component['filterPath'] = '/users';
    component['filterFrom'] = '2026-03-29T10:00';
    component['filterTo'] = '2026-03-29T12:00';

    component['clearFilters']();
    await fixture.whenStable();

    expect(component['selectedMethod']).toBeNull();
    expect(component['filterEmail']).toBe('');
    expect(component['filterPath']).toBe('');
    expect(component['filterFrom']).toBe('');
    expect(component['filterTo']).toBe('');
    expect(api.get).toHaveBeenCalledWith('audit', { page: 1, pageSize: 50 });
  });
});
