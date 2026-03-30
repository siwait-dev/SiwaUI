import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly api = inject(ApiService);

  getProfile<T>(): Observable<T> {
    return this.api.get<T>('auth/me');
  }

  updateProfile(request: UpdateProfileRequest): Observable<void> {
    return this.api.put<void>('auth/me', request);
  }
}
