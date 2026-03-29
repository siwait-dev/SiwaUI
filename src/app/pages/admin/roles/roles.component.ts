import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-roles',
  imports: [TranslateModule, CardModule, ButtonModule, TableModule],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ 'ROLES.TITLE' | translate }}</h1>
        <p-button [label]="'ROLES.ADD' | translate" icon="pi pi-plus" severity="primary" />
      </div>

      <p-card>
        <p-table [value]="[]" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'ROLES.COL_NAME' | translate }}</th>
              <th>{{ 'ROLES.COL_DESCRIPTION' | translate }}</th>
              <th>{{ 'ROLES.COL_USERS' | translate }}</th>
              <th>{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="text-center py-6 text-surface-500">
                {{ 'ROLES.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
})
export class RolesComponent {}
