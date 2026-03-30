import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login.component';
import { LoginFacade } from '../../core/store/login/login.facade';

describe('LoginComponent', () => {
  const loginFacade = {
    loading: vi.fn(),
    feedback: vi.fn(),
    submit: vi.fn(),
    consumeFeedback: vi.fn(),
  };

  beforeEach(async () => {
    loginFacade.loading.mockReset();
    loginFacade.feedback.mockReset();
    loginFacade.submit.mockReset();
    loginFacade.consumeFeedback.mockReset();

    loginFacade.loading.mockReturnValue(false);
    loginFacade.feedback.mockReturnValue(null);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: LoginFacade,
          useValue: loginFacade,
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

    expect(loginFacade.submit).not.toHaveBeenCalled();
  });

  it('submits login through the facade', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.form.setValue({ email: 'user@example.com', password: 'Password1!' });
    component.submit();

    expect(loginFacade.submit).toHaveBeenCalledWith('user@example.com', 'Password1!');
  });

  it('shows the feedback error key', () => {
    loginFacade.feedback.mockReturnValue({
      kind: 'error',
      errorKey: 'VALIDATION.INVALID_CREDENTIALS',
    });

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['errorKey']()).toBe('VALIDATION.INVALID_CREDENTIALS');
    expect(loginFacade.consumeFeedback).toHaveBeenCalled();
  });

  it('shows reset success when the query parameter is present', () => {
    TestBed.resetTestingModule();

    return TestBed.configureTestingModule({
      imports: [LoginComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: LoginFacade,
          useValue: loginFacade,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ reset: 'success' }),
            },
          },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        const fixture = TestBed.createComponent(LoginComponent);
        const component = fixture.componentInstance;
        expect(component['resetSuccess']()).toBe(true);
      });
  });
});
