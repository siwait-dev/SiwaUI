import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ForgotPasswordEffects } from '../../core/store/forgot-password/forgot-password.effects';
import { forgotPasswordFeature } from '../../core/store/forgot-password/forgot-password.reducer';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  const authService = {
    forgotPassword: vi.fn(),
  };

  beforeEach(async () => {
    authService.forgotPassword.mockReset();
    authService.forgotPassword.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideStore(),
        provideState(forgotPasswordFeature),
        provideEffects(ForgotPasswordEffects),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();
  });

  it('submits forgot-password for a valid email', async () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({ email: 'test@test.nl' });
    component.submit();
    await fixture.whenStable();

    expect(authService.forgotPassword).toHaveBeenCalledWith({ email: 'test@test.nl' });
    expect(component['sent']()).toBe(true);
  });

  it('shows server error feedback when submit fails', async () => {
    authService.forgotPassword.mockReset();
    authService.forgotPassword.mockReturnValue(throwError(() => ({ status: 500 })));

    const fixture = TestBed.createComponent(ForgotPasswordComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({ email: 'test@test.nl' });
    component.submit();
    await fixture.whenStable();

    expect(component['errorKey']()).toBe('VALIDATION.SERVER_ERROR');
  });
});
