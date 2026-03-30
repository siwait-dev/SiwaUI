import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TranslationMutationRequest {
  key: string;
  languageCode: 'nl' | 'en';
  value: string;
  module: string | null;
}

@Injectable({ providedIn: 'root' })
export class TranslationsApiService {
  private readonly api = inject(ApiService);

  getFlatTranslations<T>(): Observable<{ nl: T; en: T }> {
    return forkJoin({
      nl: this.api.get<T>('translations/nl/flat'),
      en: this.api.get<T>('translations/en/flat'),
    });
  }

  saveTranslation(
    key: string,
    module: string,
    nlValue: string,
    enValue: string,
  ): Observable<[unknown, unknown]> {
    const normalizedModule = module || null;
    const requests: [Observable<unknown>, Observable<unknown>] = [
      this.api.post<unknown>('translations', {
        key,
        languageCode: 'nl',
        value: nlValue,
        module: normalizedModule,
      } satisfies TranslationMutationRequest),
      this.api.post<unknown>('translations', {
        key,
        languageCode: 'en',
        value: enValue,
        module: normalizedModule,
      } satisfies TranslationMutationRequest),
    ];

    return forkJoin(requests);
  }

  deleteTranslation(key: string): Observable<[unknown, unknown]> {
    return forkJoin([
      this.api.delete<unknown>(`translations/nl/${encodeURIComponent(key)}`),
      this.api.delete<unknown>(`translations/en/${encodeURIComponent(key)}`),
    ]);
  }
}
