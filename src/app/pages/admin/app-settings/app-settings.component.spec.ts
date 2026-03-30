import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { AppSettingsComponent } from './app-settings.component';
import { ApiService } from '../../../core/services/api.service';
import { AppSettingsEffects } from '../../../core/store/app-settings/app-settings.effects';
import { appSettingsFeature } from '../../../core/store/app-settings/app-settings.reducer';

describe('AppSettingsComponent', () => {
  const api = {
    get: vi.fn(),
    put: vi.fn(),
  };

  const settings = {
    appName: 'SiwaUI',
    idleTimeoutEnabled: true,
    idleTimeoutMinutes: 30,
  };

  beforeEach(async () => {
    api.get.mockReset();
    api.put.mockReset();
    api.get.mockReturnValue(of(settings));
    api.put.mockReturnValue(of(settings));

    await TestBed.configureTestingModule({
      imports: [AppSettingsComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(appSettingsFeature),
        provideEffects(AppSettingsEffects),
        { provide: ApiService, useValue: api },
      ],
    }).compileComponents();
  });

  it('loads app settings on init', async () => {
    const fixture = TestBed.createComponent(AppSettingsComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(api.get).toHaveBeenCalledWith('settings');
    expect(fixture.componentInstance['appName']).toBe('SiwaUI');
    expect(fixture.componentInstance['idleEnabled']).toBe(true);
    expect(fixture.componentInstance['idleMinutes']).toBe(30);
  });

  it('saves changed settings', async () => {
    const fixture = TestBed.createComponent(AppSettingsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component['appName'] = 'Siwa Platform';
    component['idleEnabled'] = false;
    component['idleMinutes'] = 10;

    component['save']();
    await fixture.whenStable();

    expect(api.put).toHaveBeenCalledWith('settings', {
      appName: 'Siwa Platform',
      idleTimeoutEnabled: false,
      idleTimeoutMinutes: 10,
    });
    expect(component['saveSuccess']()).toBe(true);
  });

  it('shows save error feedback when persisting fails', async () => {
    api.put.mockReset();
    api.put.mockReturnValue(throwError(() => ({ status: 500 })));

    const fixture = TestBed.createComponent(AppSettingsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component['save']();
    await fixture.whenStable();

    expect(component['saveError']()).toBe(true);
  });
});
