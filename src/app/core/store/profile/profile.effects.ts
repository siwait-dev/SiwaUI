import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { ProfileApiService } from '../../services/profile-api.service';
import { ProfileActions } from './profile.actions';
import { ProfileData } from './profile.models';
import { selectProfile } from './profile.selectors';

@Injectable()
export class ProfileEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly profileApi = inject(ProfileApiService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.enterPage),
      map(() => ProfileActions.loadProfile()),
    ),
  );

  readonly loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      mergeMap(() =>
        this.profileApi.getProfile<ProfileData>().pipe(
          map(profile => ProfileActions.loadProfileSuccess({ profile })),
          catchError(() => of(ProfileActions.loadProfileFailure())),
        ),
      ),
    ),
  );

  readonly saveProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.saveProfile),
      withLatestFrom(this.store.select(selectProfile)),
      mergeMap(([, profile]) =>
        this.profileApi
          .updateProfile({
            firstName: profile.firstName,
            lastName: profile.lastName,
          })
          .pipe(
            map(() => ProfileActions.saveProfileSuccess({ profile })),
            catchError(() => of(ProfileActions.saveProfileFailure())),
          ),
      ),
    ),
  );
}
