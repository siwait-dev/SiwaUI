import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-log-viewer',
  imports: [TranslateModule, CardModule, TableModule, SelectModule, FormsModule],
  template: `
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold">{{ 'LOG_VIEWER.TITLE' | translate }}</h1>

      <p-card>
        <div class="flex gap-3 mb-4 flex-wrap">
          <p-select
            [options]="levelOptions"
            [(ngModel)]="selectedLevel"
            [placeholder]="'LOG_VIEWER.LEVEL_PLACEHOLDER' | translate"
            [showClear]="true"
            class="w-44"
          />
        </div>

        <p-table [value]="[]" [paginator]="true" [rows]="50">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'LOG_VIEWER.COL_TIMESTAMP' | translate }}</th>
              <th>{{ 'LOG_VIEWER.COL_LEVEL' | translate }}</th>
              <th>{{ 'LOG_VIEWER.COL_MESSAGE' | translate }}</th>
              <th>{{ 'LOG_VIEWER.COL_USER' | translate }}</th>
              <th>{{ 'LOG_VIEWER.COL_URL' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center py-6 text-surface-500">
                {{ 'LOG_VIEWER.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
})
export class LogViewerComponent {
  selectedLevel: string | null = null;

  readonly levelOptions = [
    { label: 'LOG_VIEWER.LEVEL_DEBUG', value: 'debug' },
    { label: 'LOG_VIEWER.LEVEL_INFO', value: 'info' },
    { label: 'LOG_VIEWER.LEVEL_WARN', value: 'warn' },
    { label: 'LOG_VIEWER.LEVEL_ERROR', value: 'error' },
    { label: 'LOG_VIEWER.LEVEL_CRITICAL', value: 'critical' },
  ];
}
