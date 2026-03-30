import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthAccountApiService {
  private readonly api = inject(ApiService);

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.api.post<void>('auth/change-password', request);
  }
}
