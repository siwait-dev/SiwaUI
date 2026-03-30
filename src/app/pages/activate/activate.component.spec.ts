import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ActivateEffects } from '../../core/store/activate/activate.effects';
import { activateFeature } from '../../core/store/activate/activate.reducer';
import { ActivateComponent } from './activate.component';

describe('ActivateComponent', () => {
  const authService = {
    activate: vi.fn(),
  };

  const router = {
    navigate: vi.fn(() => Promise.resolve(true)),
  };

  const queryGet = vi.fn((key: string) =>
    key === 'email' ? 'test@test.nl' : key === 'token' ? 'VALID-TOKEN' : null,
  );

  beforeEach(async () => {
    authService.activate.mockReset();
    router.navigate.mockClear();
    queryGet.mockClear();
    queryGet.mockImplementation((key: string) =>
      key === 'email' ? 'test@test.nl' : key === 'token' ? 'VALID-TOKEN' : null,
    );
    authService.activate.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [ActivateComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideStore(),
        provideState(activateFeature),
        provideEffects(ActivateEffects),
        { provide: AuthService, useValue: authService },
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

  it('shows no-params state when query params are missing', async () => {
    queryGet.mockImplementation(() => null);

    const fixture = TestBed.createComponent(ActivateComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance['status']()).toBe('no-params');
  });

  it('activates and shows success state with valid params', async () => {
    const fixture = TestBed.createComponent(ActivateComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(authService.activate).toHaveBeenCalledWith({
      email: 'test@test.nl',
      token: 'VALID-TOKEN',
    });
    expect(fixture.componentInstance['status']()).toBe('success');
  });

  it('shows error state when activation fails', async () => {
    authService.activate.mockReset();
    authService.activate.mockReturnValue(throwError(() => ({ status: 400 })));

    const fixture = TestBed.createComponent(ActivateComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance['status']()).toBe('error');
  });
});
