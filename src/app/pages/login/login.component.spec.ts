import { ActivatedRoute, convertToParamMap, Router, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent', () => {
  const authService = {
    login: vi.fn(),
  };

  beforeEach(async () => {
    authService.login.mockReset();

    await TestBed.configureTestingModule({
      imports: [LoginComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('does not submit when the form is invalid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.submit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('navigates to dashboard after a successful login', () => {
    authService.login.mockReturnValue(
      of({ accessToken: 'token', refreshToken: 'refresh', mustChangePassword: false }),
    );

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.form.setValue({ email: 'user@example.com', password: 'Password1!' });
    component.submit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Password1!',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/app/dashboard']);
  });

  it('navigates to change-password when the backend requires it', () => {
    authService.login.mockReturnValue(
      of({ accessToken: 'token', refreshToken: 'refresh', mustChangePassword: true }),
    );

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.form.setValue({ email: 'user@example.com', password: 'Password1!' });
    component.submit();

    expect(navigateSpy).toHaveBeenCalledWith(['/app/change-password'], {
      queryParams: { reason: 'expired' },
    });
  });

  it('shows the invalid credentials key on a 401 error', () => {
    authService.login.mockReturnValue(throwError(() => ({ status: 401 })));

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.form.setValue({ email: 'user@example.com', password: 'Password1!' });
    component.submit();

    expect(component['errorKey']()).toBe('VALIDATION.INVALID_CREDENTIALS');
  });
});
