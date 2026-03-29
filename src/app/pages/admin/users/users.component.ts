import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-users',
  imports: [TranslateModule, CardModule, ButtonModule, TableModule, TagModule],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ 'USERS.TITLE' | translate }}</h1>
        <p-button [label]="'USERS.ADD' | translate" icon="pi pi-plus" severity="primary" />
      </div>

      <p-card>
        <p-table [value]="[]" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'USERS.COL_NAME' | translate }}</th>
              <th>{{ 'USERS.COL_EMAIL' | translate }}</th>
              <th>{{ 'USERS.COL_ROLES' | translate }}</th>
              <th>{{ 'COMMON.STATUS' | translate }}</th>
              <th>{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center py-6 text-surface-500">
                {{ 'USERS.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
})
export class UsersComponent {}
