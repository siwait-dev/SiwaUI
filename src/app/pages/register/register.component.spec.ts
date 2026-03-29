import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/services/auth.service';
import { PasswordPolicyService } from '../../core/services/password-policy.service';

describe('RegisterComponent', () => {
  const authService = {
    register: vi.fn(),
  };

  const passwordPolicyService = {
    getPolicy: vi.fn(),
    passwordValidator: vi.fn(),
  };

  beforeEach(async () => {
    authService.register.mockReset();
    passwordPolicyService.getPolicy.mockReset();
    passwordPolicyService.passwordValidator.mockReset();

    passwordPolicyService.getPolicy.mockReturnValue(
      of({
        minLength: 8,
        requireDigit: true,
        requireUppercase: true,
        requireNonAlphanumeric: true,
        maxAgeDays: 90,
        historyCount: 5,
        checkBreachedPasswords: false,
        refreshTokenExpirationDays: 7,
      }),
    );
    passwordPolicyService.passwordValidator.mockReturnValue(() => null);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: PasswordPolicyService,
          useValue: passwordPolicyService,
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compileComponents();
  });

  it('loads the password policy on init', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    expect(passwordPolicyService.getPolicy).toHaveBeenCalled();
    expect(passwordPolicyService.passwordValidator).toHaveBeenCalled();
  });

  it('does not submit when the form is invalid', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.submit();

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('navigates to activation after a successful registration', () => {
    authService.register.mockReturnValue(of(void 0));

    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();

    component.form.setValue({
      firstName: 'Mohamed',
      lastName: 'Ben Moussa',
      email: 'user@example.com',
      password: 'Password1!',
    });
    component.submit();

    expect(authService.register).toHaveBeenCalledWith({
      firstName: 'Mohamed',
      lastName: 'Ben Moussa',
      email: 'user@example.com',
      password: 'Password1!',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/activate'], {
      queryParams: { email: 'user@example.com' },
    });
  });

  it('shows account exists on a 409 error', () => {
    authService.register.mockReturnValue(throwError(() => ({ status: 409 })));

    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.form.setValue({
      firstName: 'Mohamed',
      lastName: 'Ben Moussa',
      email: 'user@example.com',
      password: 'Password1!',
    });
    component.submit();

    expect(component['errorKey']()).toBe('VALIDATION.ACCOUNT_EXISTS');
  });
});
