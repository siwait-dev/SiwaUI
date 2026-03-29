import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-translations',
  imports: [TranslateModule, CardModule, ButtonModule, TableModule, InputTextModule],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ 'TRANSLATIONS.TITLE' | translate }}</h1>
        <p-button [label]="'TRANSLATIONS.ADD' | translate" icon="pi pi-plus" severity="primary" />
      </div>

      <p-card>
        <div class="mb-4">
          <input
            pInputText
            [placeholder]="'TRANSLATIONS.SEARCH_PLACEHOLDER' | translate"
            class="w-full max-w-sm"
          />
        </div>
        <p-table [value]="[]" [paginator]="true" [rows]="20">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'TRANSLATIONS.COL_KEY' | translate }}</th>
              <th>{{ 'TRANSLATIONS.COL_NL' | translate }}</th>
              <th>{{ 'TRANSLATIONS.COL_EN' | translate }}</th>
              <th>{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="text-center py-6 text-surface-500">
                {{ 'TRANSLATIONS.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
})
export class TranslationsComponent {}
