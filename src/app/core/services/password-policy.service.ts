import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface PasswordPolicy {
  minLength: number;
  requireDigit: boolean;
  requireUppercase: boolean;
  requireNonAlphanumeric: boolean;
  maxAgeDays: number;
  historyCount: number;
  checkBreachedPasswords: boolean;
  refreshTokenExpirationDays: number;
}

@Injectable({ providedIn: 'root' })
export class PasswordPolicyService {
  private readonly api = inject(ApiService);

  private _policy: PasswordPolicy | null = null;
  private _policy$: Observable<PasswordPolicy> | null = null;

  /** Haal het beleid op (gecached na eerste aanroep). */
  getPolicy(): Observable<PasswordPolicy> {
    if (this._policy) return of(this._policy);
    if (this._policy$) return this._policy$;

    this._policy$ = this.api.get<PasswordPolicy>('password-policy').pipe(
      tap(p => {
        this._policy = p;
      }),
      shareReplay(1),
    );
    return this._policy$;
  }

  /** Synchrone validatie op basis van gecached beleid (gebruik na getPolicy()). */
  validatePassword(password: string): string[] {
    const policy = this._policy;
    if (!policy) return [];

    const errors: string[] = [];
    if (password.length < policy.minLength)
      errors.push(`VALIDATION.PASSWORD_MIN_LENGTH:${policy.minLength}`);
    if (policy.requireDigit && !/\d/.test(password))
      errors.push('VALIDATION.PASSWORD_REQUIRES_DIGIT');
    if (policy.requireUppercase && !/[A-Z]/.test(password))
      errors.push('VALIDATION.PASSWORD_REQUIRES_UPPERCASE');
    if (policy.requireNonAlphanumeric && !/[^a-zA-Z0-9]/.test(password))
      errors.push('VALIDATION.PASSWORD_REQUIRES_SPECIAL');
    return errors;
  }

  /** Angular-validator factory — gebruik in FormGroup na laden van beleid. */
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const errs = this.validatePassword(control.value as string);
      return errs.length ? { passwordPolicy: errs } : null;
    };
  }
}
