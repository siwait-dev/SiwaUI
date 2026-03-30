import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PasswordPolicyApiService {
  private readonly api = inject(ApiService);

  getPolicy<T>(): Observable<T> {
    return this.api.get<T>('password-policy');
  }

  updatePolicy<T>(policy: T): Observable<T> {
    return this.api.put<T>('password-policy', policy);
  }
}
