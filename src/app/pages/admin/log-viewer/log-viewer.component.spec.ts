import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LogViewerComponent } from './log-viewer.component';
import { ApiService } from '../../../core/services/api.service';
import { LogViewerEffects } from '../../../core/store/log-viewer/log-viewer.effects';
import { logViewerFeature } from '../../../core/store/log-viewer/log-viewer.reducer';

describe('LogViewerComponent', () => {
  const api = {
    get: vi.fn(),
  };

  const logResponse = {
    items: [
      {
        id: 1,
        level: 'error',
        message: 'Something failed',
        stackTrace: 'Error: stack',
        url: '/app/admin/users',
        userAgent: 'Playwright',
        userId: '1',
        correlationId: 'corr-123',
        timestamp: '2026-03-29T12:00:00Z',
        actionTrail: 'Open users',
        context: '{"module":"users"}',
      },
    ],
    totalCount: 1,
    page: 1,
    pageSize: 50,
    totalPages: 1,
  };

  beforeEach(async () => {
    api.get.mockReset();
    api.get.mockReturnValue(of(logResponse));

    await TestBed.configureTestingModule({
      imports: [LogViewerComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(logViewerFeature),
        provideEffects(LogViewerEffects),
        { provide: ApiService, useValue: api },
      ],
    }).compileComponents();
  });

  it('loads client logs on init', async () => {
    const fixture = TestBed.createComponent(LogViewerComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(api.get).toHaveBeenCalledWith('logs/client', { page: 1, pageSize: 50 });
    expect(fixture.componentInstance['logs']()).toHaveLength(1);
  });

  it('reloads with correlation filter', async () => {
    const fixture = TestBed.createComponent(LogViewerComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    api.get.mockClear();
    component['filterCorrelationId'] = 'corr-999';

    component['reload']();
    await fixture.whenStable();

    expect(api.get).toHaveBeenCalledWith('logs/client', {
      page: 1,
      pageSize: 50,
      correlationId: 'corr-999',
    });
  });

  it('clears filters and reloads the first page', async () => {
    const fixture = TestBed.createComponent(LogViewerComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    api.get.mockClear();
    component['selectedLevel'] = 'error';
    component['filterUserId'] = '1';
    component['filterCorrelationId'] = 'corr-123';
    component['filterFrom'] = '2026-03-29T10:00';
    component['filterTo'] = '2026-03-29T12:00';

    component['clearFilters']();
    await fixture.whenStable();

    expect(component['selectedLevel']).toBeNull();
    expect(component['filterUserId']).toBe('');
    expect(component['filterCorrelationId']).toBe('');
    expect(component['filterFrom']).toBe('');
    expect(component['filterTo']).toBe('');
    expect(api.get).toHaveBeenCalledWith('logs/client', { page: 1, pageSize: 50 });
  });
});
