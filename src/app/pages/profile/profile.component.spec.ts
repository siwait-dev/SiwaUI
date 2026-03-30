import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ProfileEffects } from '../../core/store/profile/profile.effects';
import { profileFeature } from '../../core/store/profile/profile.reducer';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  const api = {
    get: vi.fn(),
    put: vi.fn(),
  };

  const profile = {
    userId: '1',
    email: 'test@test.nl',
    firstName: 'Jan',
    lastName: 'Jansen',
    roles: ['Admin'],
  };

  beforeEach(async () => {
    api.get.mockReset();
    api.put.mockReset();
    api.get.mockReturnValue(of(profile));
    api.put.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(profileFeature),
        provideEffects(ProfileEffects),
        { provide: ApiService, useValue: api },
      ],
    }).compileComponents();
  });

  it('loads profile data on init', async () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(api.get).toHaveBeenCalledWith('auth/me');
    expect(fixture.componentInstance.form.getRawValue()).toEqual({
      firstName: 'Jan',
      lastName: 'Jansen',
    });
    expect(fixture.componentInstance['email']()).toBe('test@test.nl');
  });

  it('saves updated profile data', async () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({ firstName: 'Piet', lastName: 'Pieters' });
    component.save();
    await fixture.whenStable();

    expect(api.put).toHaveBeenCalledWith('auth/me', {
      firstName: 'Piet',
      lastName: 'Pieters',
    });
    expect(component['saveSuccess']()).toBe(true);
  });

  it('shows save error feedback when persisting fails', async () => {
    api.put.mockReset();
    api.put.mockReturnValue(throwError(() => ({ status: 400 })));

    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.save();
    await fixture.whenStable();

    expect(component['saveError']()).toBe(true);
  });
});
