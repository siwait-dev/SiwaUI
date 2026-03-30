import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AppSettingsApiService {
  private readonly api = inject(ApiService);

  getSettings<T>(): Observable<T> {
    return this.api.get<T>('settings');
  }

  updateSettings<T>(config: T): Observable<T> {
    return this.api.put<T>('settings', config);
  }
}
