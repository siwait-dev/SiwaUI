import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-audit-log',
  imports: [TranslateModule, CardModule, TableModule],
  template: `
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold">{{ 'AUDIT_LOG.TITLE' | translate }}</h1>

      <p-card>
        <p-table [value]="[]" [paginator]="true" [rows]="50">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'AUDIT_LOG.COL_TIMESTAMP' | translate }}</th>
              <th>{{ 'AUDIT_LOG.COL_USER' | translate }}</th>
              <th>{{ 'AUDIT_LOG.COL_ACTION' | translate }}</th>
              <th>{{ 'AUDIT_LOG.COL_RESOURCE' | translate }}</th>
              <th>{{ 'AUDIT_LOG.COL_IP' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center py-6 text-surface-500">
                {{ 'AUDIT_LOG.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
})
export class AuditLogComponent {}
