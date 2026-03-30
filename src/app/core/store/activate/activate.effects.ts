import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, delay, map, mergeMap, of, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivateActions } from './activate.actions';

@Injectable()
export class ActivateEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivateActions.submit),
      mergeMap(({ email, token }) =>
        this.authService.activate({ email, token }).pipe(
          map(() => ActivateActions.submitSuccess()),
          catchError(() => of(ActivateActions.submitFailure())),
        ),
      ),
    ),
  );

  readonly navigateAfterSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ActivateActions.submitSuccess),
        delay(3000),
        tap(() => void this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );
}
