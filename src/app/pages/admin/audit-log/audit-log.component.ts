import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuditLogDto } from '../../../core/store/audit-log/audit-log.models';
import { AuditLogFacade } from '../../../core/store/audit-log/audit-log.facade';
import { SiwaDatePipe } from '../../../../../projects/siwa-ui/src/lib/pipes/siwa-date.pipe';
import { ADMIN_LOGS_PAGE_SIZE } from '../../../core/constants/paging.constants';

@Component({
  selector: 'app-audit-log',
  imports: [
    TranslateModule,
    CardModule,
    TableModule,
    TagModule,
    SelectModule,
    FormsModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    SiwaDatePipe,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold">{{ 'ADMIN.AUDIT_LOG.TITLE' | translate }}</h1>

      <p-card>
        <div class="flex gap-3 mb-4 flex-wrap">
          <p-select
            [options]="methodOptions"
            [(ngModel)]="selectedMethod"
            [placeholder]="'ADMIN.AUDIT_LOG.FILTER_METHOD' | translate"
            [showClear]="true"
            (ngModelChange)="reload()"
            class="w-40"
          />
          <input
            pInputText
            [(ngModel)]="filterEmail"
            [placeholder]="'ADMIN.AUDIT_LOG.FILTER_EMAIL' | translate"
            (keyup.enter)="reload()"
            class="w-48"
          />
          <input
            pInputText
            [(ngModel)]="filterPath"
            [placeholder]="'ADMIN.AUDIT_LOG.FILTER_PATH' | translate"
            (keyup.enter)="reload()"
            class="w-56"
          />
          <input
            type="datetime-local"
            [(ngModel)]="filterFrom"
            (change)="reload()"
            class="rounded-md border border-surface-300 bg-transparent px-3 py-2 text-sm dark:border-surface-700"
          />
          <input
            type="datetime-local"
            [(ngModel)]="filterTo"
            (change)="reload()"
            class="rounded-md border border-surface-300 bg-transparent px-3 py-2 text-sm dark:border-surface-700"
          />
          <p-button
            [label]="'ADMIN.AUDIT_LOG.CLEAR_FILTERS' | translate"
            icon="pi pi-filter-slash"
            severity="secondary"
            [outlined]="true"
            (onClick)="clearFilters()"
          />
        </div>

        <p-table
          [value]="logs()"
          [lazy]="true"
          [paginator]="true"
          [rows]="pageSize"
          [totalRecords]="totalCount()"
          [loading]="loading()"
          (onLazyLoad)="onLazyLoad($event)"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'ADMIN.AUDIT_LOG.COL_TIMESTAMP' | translate }}</th>
              <th>{{ 'ADMIN.AUDIT_LOG.COL_ACTION' | translate }}</th>
              <th>{{ 'ADMIN.AUDIT_LOG.COL_RESOURCE' | translate }}</th>
              <th>{{ 'ADMIN.AUDIT_LOG.COL_USER' | translate }}</th>
              <th>{{ 'ADMIN.AUDIT_LOG.COL_STATUS' | translate }}</th>
              <th>{{ 'ADMIN.AUDIT_LOG.COL_IP' | translate }}</th>
              <th>{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-log>
            <tr>
              <td class="text-sm whitespace-nowrap">{{ log.timestamp | siwaDate: 'dateTime' }}</td>
              <td>
                <p-tag [value]="log.method" [severity]="methodSeverity(log.method)" />
              </td>
              <td class="font-mono text-sm max-w-xs truncate">{{ log.path }}</td>
              <td class="text-sm">{{ log.email ?? '—' }}</td>
              <td>
                <p-tag [value]="'' + log.statusCode" [severity]="statusSeverity(log.statusCode)" />
              </td>
              <td class="text-sm">{{ log.ipAddress ?? '—' }}</td>
              <td>
                <p-button
                  [label]="'ADMIN.AUDIT_LOG.DETAILS' | translate"
                  icon="pi pi-eye"
                  severity="secondary"
                  size="small"
                  [outlined]="true"
                  (onClick)="openDetails(log)"
                />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center py-6 text-surface-500">
                {{ 'ADMIN.AUDIT_LOG.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <p-dialog
      [(visible)]="detailsDialogVisible"
      [header]="'ADMIN.AUDIT_LOG.DETAILS_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '640px' }"
    >
      @if (selectedLog()) {
        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{
              'ADMIN.AUDIT_LOG.COL_TIMESTAMP' | translate
            }}</span>
            <span>{{ selectedLog()!.timestamp | siwaDate: 'dateTime' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{
              'ADMIN.AUDIT_LOG.COL_ACTION' | translate
            }}</span>
            <p-tag
              [value]="selectedLog()!.method"
              [severity]="methodSeverity(selectedLog()!.method)"
            />
          </div>
          <div class="flex flex-col gap-1 md:col-span-2">
            <span class="text-sm text-surface-500">{{
              'ADMIN.AUDIT_LOG.COL_RESOURCE' | translate
            }}</span>
            <span class="font-mono text-sm break-all">{{ selectedLog()!.path }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{
              'ADMIN.AUDIT_LOG.COL_USER' | translate
            }}</span>
            <span>{{ selectedLog()!.email ?? '-' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'ADMIN.AUDIT_LOG.COL_IP' | translate }}</span>
            <span>{{ selectedLog()!.ipAddress ?? '-' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{
              'ADMIN.AUDIT_LOG.COL_STATUS' | translate
            }}</span>
            <p-tag
              [value]="selectedLog()!.statusCode.toString()"
              [severity]="statusSeverity(selectedLog()!.statusCode)"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{
              'ADMIN.AUDIT_LOG.COL_DURATION' | translate
            }}</span>
            <span>{{ selectedLog()!.durationMs }} ms</span>
          </div>
        </div>
      }
      <ng-template pTemplate="footer">
        <p-button
          [label]="'COMMON.CLOSE' | translate"
          severity="secondary"
          (onClick)="detailsDialogVisible = false"
        />
      </ng-template>
    </p-dialog>
  `,
})
export class AuditLogComponent implements OnInit {
  private readonly auditLogFacade = inject(AuditLogFacade);

  protected readonly logs = this.auditLogFacade.logs;
  protected readonly totalCount = this.auditLogFacade.totalCount;
  protected readonly loading = this.auditLogFacade.loading;
  protected readonly selectedLog = signal<AuditLogDto | null>(null);

  protected selectedMethod: string | null = null;
  protected filterEmail = '';
  protected filterPath = '';
  protected filterFrom = '';
  protected filterTo = '';
  protected detailsDialogVisible = false;
  protected pageSize = ADMIN_LOGS_PAGE_SIZE;
  private currentPage = 1;

  readonly methodOptions = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
  ];

  ngOnInit(): void {
    this.auditLogFacade.enterPage();
  }

  protected onLazyLoad(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? this.pageSize;
    const page = event.first !== undefined ? Math.floor(event.first / rows) + 1 : 1;
    this.currentPage = page;
    this.pageSize = rows;
    this.auditLogFacade.setPage(page, rows);
  }

  protected reload(): void {
    this.auditLogFacade.setMethodFilter(this.selectedMethod);
    this.auditLogFacade.setEmailFilter(this.filterEmail);
    this.auditLogFacade.setPathFilter(this.filterPath);
    this.auditLogFacade.setDateRange(this.filterFrom, this.filterTo);
  }

  protected clearFilters(): void {
    this.selectedMethod = null;
    this.filterEmail = '';
    this.filterPath = '';
    this.filterFrom = '';
    this.filterTo = '';
    this.auditLogFacade.clearFilters();
  }

  protected openDetails(log: AuditLogDto): void {
    this.selectedLog.set(log);
    this.detailsDialogVisible = true;
  }

  protected methodSeverity(method: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (method) {
      case 'GET':
        return 'info';
      case 'POST':
        return 'success';
      case 'PUT':
        return 'warn';
      case 'DELETE':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  protected statusSeverity(code: number): 'success' | 'warn' | 'danger' | 'secondary' {
    if (code < 300) return 'success';
    if (code < 400) return 'secondary';
    if (code < 500) return 'warn';
    return 'danger';
  }
}
