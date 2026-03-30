import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { PasswordPolicyEffects } from '../../../core/store/password-policy/password-policy.effects';
import { passwordPolicyFeature } from '../../../core/store/password-policy/password-policy.reducer';
import { PasswordPolicyComponent } from './password-policy.component';

describe('PasswordPolicyComponent', () => {
  const api = {
    get: vi.fn(),
    put: vi.fn(),
  };

  const policy = {
    minLength: 12,
    requireDigit: true,
    requireUppercase: true,
    requireNonAlphanumeric: false,
    maxAgeDays: 90,
    historyCount: 5,
    checkBreachedPasswords: true,
    refreshTokenExpirationDays: 14,
  };

  beforeEach(async () => {
    api.get.mockReset();
    api.put.mockReset();
    api.get.mockReturnValue(of(policy));
    api.put.mockReturnValue(of(policy));

    await TestBed.configureTestingModule({
      imports: [PasswordPolicyComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(passwordPolicyFeature),
        provideEffects(PasswordPolicyEffects),
        { provide: ApiService, useValue: api },
      ],
    }).compileComponents();
  });

  it('loads password policy on init', async () => {
    const fixture = TestBed.createComponent(PasswordPolicyComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(api.get).toHaveBeenCalledWith('password-policy');
    expect(fixture.componentInstance.form.getRawValue()).toMatchObject(policy);
  });

  it('saves a valid password policy', async () => {
    const fixture = TestBed.createComponent(PasswordPolicyComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({
      minLength: 16,
      requireDigit: true,
      requireUppercase: true,
      refreshTokenExpirationDays: 21,
    });

    component.save();
    await fixture.whenStable();

    expect(api.put).toHaveBeenCalledWith('password-policy', {
      minLength: 16,
      requireDigit: true,
      requireUppercase: true,
      requireNonAlphanumeric: false,
      maxAgeDays: 90,
      historyCount: 5,
      checkBreachedPasswords: true,
      refreshTokenExpirationDays: 21,
    });
    expect(component['saveSuccess']()).toBe(true);
  });

  it('shows save error feedback when persisting fails', async () => {
    api.put.mockReset();
    api.put.mockReturnValue(throwError(() => ({ status: 500 })));

    const fixture = TestBed.createComponent(PasswordPolicyComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.save();
    await fixture.whenStable();

    expect(component['saveError']()).toBe(true);
  });
});
