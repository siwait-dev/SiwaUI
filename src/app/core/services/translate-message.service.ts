import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslateMessageService {
  private readonly translate = inject(TranslateService);

  instant(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }
}
