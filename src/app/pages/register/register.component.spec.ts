import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterComponent } from './register.component';
import { PasswordPolicyService } from '../../core/services/password-policy.service';
import { RegisterFacade } from '../../core/store/register/register.facade';

describe('RegisterComponent', () => {
  const passwordPolicyService = {
    passwordValidator: vi.fn(),
  };

  const registerFacade = {
    policyReady: vi.fn(),
    loading: vi.fn(),
    feedback: vi.fn(),
    enterPage: vi.fn(),
    submit: vi.fn(),
    consumeFeedback: vi.fn(),
  };

  beforeEach(async () => {
    passwordPolicyService.passwordValidator.mockReset();
    registerFacade.policyReady.mockReset();
    registerFacade.loading.mockReset();
    registerFacade.feedback.mockReset();
    registerFacade.enterPage.mockReset();
    registerFacade.submit.mockReset();
    registerFacade.consumeFeedback.mockReset();

    passwordPolicyService.passwordValidator.mockReturnValue(() => null);
    registerFacade.policyReady.mockReturnValue(true);
    registerFacade.loading.mockReturnValue(false);
    registerFacade.feedback.mockReturnValue(null);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: PasswordPolicyService,
          useValue: passwordPolicyService,
        },
        {
          provide: RegisterFacade,
          useValue: registerFacade,
        },
      ],
    }).compileComponents();
  });

  it('loads the password policy on init', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    expect(registerFacade.enterPage).toHaveBeenCalled();
    expect(passwordPolicyService.passwordValidator).toHaveBeenCalled();
  });

  it('does not submit when the form is invalid', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.submit();

    expect(registerFacade.submit).not.toHaveBeenCalled();
  });

  it('submits the registration through the facade', () => {
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

    expect(registerFacade.submit).toHaveBeenCalledWith(
      'Mohamed',
      'Ben Moussa',
      'user@example.com',
      'Password1!',
    );
  });

  it('shows facade feedback as an error key', () => {
    registerFacade.feedback.mockReturnValue({
      kind: 'error',
      errorKey: 'VALIDATION.ACCOUNT_EXISTS',
    });

    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['errorKey']()).toBe('VALIDATION.ACCOUNT_EXISTS');
    expect(registerFacade.consumeFeedback).toHaveBeenCalled();
  });
});
