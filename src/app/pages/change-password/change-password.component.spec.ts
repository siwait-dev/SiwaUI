import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { PasswordPolicyService } from '../../core/services/password-policy.service';
import { ChangePasswordEffects } from '../../core/store/change-password/change-password.effects';
import { changePasswordFeature } from '../../core/store/change-password/change-password.reducer';
import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  const api = {
    post: vi.fn(),
  };

  const policyService = {
    getPolicy: vi.fn(),
    passwordValidator: vi.fn(),
  };

  const router = {
    navigate: vi.fn(() => Promise.resolve(true)),
  };

  beforeEach(async () => {
    api.post.mockReset();
    policyService.getPolicy.mockReset();
    policyService.passwordValidator.mockReset();
    router.navigate.mockClear();

    policyService.getPolicy.mockReturnValue(of({}));
    policyService.passwordValidator.mockReturnValue(() => null);
    api.post.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(changePasswordFeature),
        provideEffects(ChangePasswordEffects),
        { provide: ApiService, useValue: api },
        { provide: PasswordPolicyService, useValue: policyService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: vi.fn(() => null),
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('loads password policy on init', async () => {
    const fixture = TestBed.createComponent(ChangePasswordComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(policyService.getPolicy).toHaveBeenCalled();
    expect(policyService.passwordValidator).toHaveBeenCalled();
  });

  it('submits the change-password request', async () => {
    const fixture = TestBed.createComponent(ChangePasswordComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({
      currentPassword: 'OldPass1!',
      newPassword: 'NewPass1!',
      confirmPassword: 'NewPass1!',
    });

    component.submit();
    await fixture.whenStable();

    expect(api.post).toHaveBeenCalledWith('auth/change-password', {
      currentPassword: 'OldPass1!',
      newPassword: 'NewPass1!',
    });
    expect(component['successMessage']()).toBe(true);
  });

  it('maps a 400 response to invalid credentials', async () => {
    api.post.mockReset();
    api.post.mockReturnValue(throwError(() => ({ status: 400 })));

    const fixture = TestBed.createComponent(ChangePasswordComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({
      currentPassword: 'WrongOld1!',
      newPassword: 'NewPass1!',
      confirmPassword: 'NewPass1!',
    });

    component.submit();
    await fixture.whenStable();

    expect(component['errorKey']()).toBe('VALIDATION.INVALID_CREDENTIALS');
  });
});
