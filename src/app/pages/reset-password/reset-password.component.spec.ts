import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { PasswordPolicyService } from '../../core/services/password-policy.service';
import { ResetPasswordEffects } from '../../core/store/reset-password/reset-password.effects';
import { resetPasswordFeature } from '../../core/store/reset-password/reset-password.reducer';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  const authService = {
    resetPassword: vi.fn(),
  };

  const policyService = {
    getPolicy: vi.fn(),
    passwordValidator: vi.fn(),
  };

  const router = {
    navigate: vi.fn(() => Promise.resolve(true)),
  };

  const queryGet = vi.fn((key: string) =>
    key === 'email' ? 'test@test.nl' : key === 'token' ? 'VALID-TOKEN' : null,
  );

  beforeEach(async () => {
    authService.resetPassword.mockReset();
    policyService.getPolicy.mockReset();
    policyService.passwordValidator.mockReset();
    router.navigate.mockClear();
    queryGet.mockClear();
    queryGet.mockImplementation((key: string) =>
      key === 'email' ? 'test@test.nl' : key === 'token' ? 'VALID-TOKEN' : null,
    );

    policyService.getPolicy.mockReturnValue(of({}));
    policyService.passwordValidator.mockReturnValue(() => null);
    authService.resetPassword.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(resetPasswordFeature),
        provideEffects(ResetPasswordEffects),
        { provide: AuthService, useValue: authService },
        { provide: PasswordPolicyService, useValue: policyService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: queryGet,
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('redirects to forgot-password when params are missing', async () => {
    queryGet.mockImplementation(() => null);

    const fixture = TestBed.createComponent(ResetPasswordComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/forgot-password']);
  });

  it('loads policy and submits reset-password with valid params', async () => {
    const fixture = TestBed.createComponent(ResetPasswordComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(policyService.getPolicy).toHaveBeenCalled();

    component.form.patchValue({
      newPassword: 'NieuwWW1!',
      confirmPassword: 'NieuwWW1!',
    });
    component.submit();
    await fixture.whenStable();

    expect(authService.resetPassword).toHaveBeenCalledWith({
      email: 'test@test.nl',
      token: 'VALID-TOKEN',
      newPassword: 'NieuwWW1!',
    });
  });

  it('maps invalid token responses to the reset-token error key', async () => {
    authService.resetPassword.mockReset();
    authService.resetPassword.mockReturnValue(throwError(() => ({ status: 400 })));

    const fixture = TestBed.createComponent(ResetPasswordComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({
      newPassword: 'NieuwWW1!',
      confirmPassword: 'NieuwWW1!',
    });
    component.submit();
    await fixture.whenStable();

    expect(component['errorKey']()).toBe('VALIDATION.INVALID_RESET_TOKEN');
  });
});
