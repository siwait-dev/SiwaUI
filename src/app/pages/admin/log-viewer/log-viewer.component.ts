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
import { ClientLogDto } from '../../../core/store/log-viewer/log-viewer.models';
import { LogViewerFacade } from '../../../core/store/log-viewer/log-viewer.facade';
import { SiwaDatePipe } from '../../../../../projects/siwa-ui/src/lib/pipes/siwa-date.pipe';
import { ADMIN_LOGS_PAGE_SIZE } from '../../../core/constants/paging.constants';

@Component({
  selector: 'app-log-viewer',
  imports: [
    TranslateModule,
    CardModule,
    TableModule,
    SelectModule,
    FormsModule,
    TagModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SiwaDatePipe,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold">{{ 'ADMIN.LOG_VIEWER.TITLE' | translate }}</h1>

      <p-card>
        <div class="flex gap-3 mb-4 flex-wrap">
          <p-select
            [options]="levelOptions"
            [(ngModel)]="selectedLevel"
            [placeholder]="'ADMIN.LOG_VIEWER.LEVEL_PLACEHOLDER' | translate"
            [showClear]="true"
            (ngModelChange)="reload()"
            class="w-44"
          />
          <input
            pInputText
            [(ngModel)]="filterUserId"
            [placeholder]="'ADMIN.LOG_VIEWER.FILTER_USER' | translate"
            (keyup.enter)="reload()"
            class="w-48"
          />
          <input
            pInputText
            [(ngModel)]="filterCorrelationId"
            [placeholder]="'ADMIN.LOG_VIEWER.FILTER_CORRELATION' | translate"
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
            [label]="'ADMIN.LOG_VIEWER.CLEAR_FILTERS' | translate"
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
              <th>{{ 'ADMIN.LOG_VIEWER.COL_TIMESTAMP' | translate }}</th>
              <th>{{ 'ADMIN.LOG_VIEWER.COL_LEVEL' | translate }}</th>
              <th>{{ 'ADMIN.LOG_VIEWER.COL_MESSAGE' | translate }}</th>
              <th>{{ 'ADMIN.LOG_VIEWER.COL_USER' | translate }}</th>
              <th>{{ 'ADMIN.LOG_VIEWER.COL_CORRELATION' | translate }}</th>
              <th>{{ 'ADMIN.LOG_VIEWER.COL_URL' | translate }}</th>
              <th>{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-log>
            <tr>
              <td class="text-sm whitespace-nowrap">{{ log.timestamp | siwaDate: 'dateTime' }}</td>
              <td>
                <p-tag [value]="log.level" [severity]="levelSeverity(log.level)" />
              </td>
              <td class="max-w-md truncate text-sm">{{ log.message }}</td>
              <td class="text-sm">{{ log.userId ?? '—' }}</td>
              <td class="font-mono text-sm max-w-xs truncate">{{ log.correlationId ?? '—' }}</td>
              <td class="font-mono text-sm max-w-xs truncate">{{ log.url }}</td>
              <td>
                <p-button
                  [label]="'ADMIN.LOG_VIEWER.DETAILS' | translate"
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
                {{ 'ADMIN.LOG_VIEWER.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <p-dialog
      [(visible)]="detailsDialogVisible"
      [header]="'ADMIN.LOG_VIEWER.DETAILS_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '760px' }"
    >
      @if (selectedLog()) {
        <div class="flex flex-col gap-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_TIMESTAMP' | translate
              }}</span>
              <span>{{ selectedLog()!.timestamp | siwaDate: 'dateTime' }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_LEVEL' | translate
              }}</span>
              <p-tag
                [value]="selectedLog()!.level"
                [severity]="levelSeverity(selectedLog()!.level)"
              />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_MESSAGE' | translate
              }}</span>
              <span>{{ selectedLog()!.message }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_USER' | translate
              }}</span>
              <span>{{ selectedLog()!.userId ?? '—' }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_CORRELATION' | translate
              }}</span>
              <span class="font-mono text-sm">{{ selectedLog()!.correlationId ?? '—' }}</span>
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_URL' | translate
              }}</span>
              <span class="font-mono text-sm break-all">{{ selectedLog()!.url }}</span>
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_USER_AGENT' | translate
              }}</span>
              <span class="text-sm break-all">{{ selectedLog()!.userAgent ?? '—' }}</span>
            </div>
          </div>

          @if (selectedLog()!.actionTrail) {
            <div class="flex flex-col gap-1">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_ACTION_TRAIL' | translate
              }}</span>
              <pre
                class="overflow-auto rounded-lg bg-surface-100 p-3 text-xs dark:bg-surface-900"
                >{{ selectedLog()!.actionTrail }}</pre
              >
            </div>
          }

          @if (selectedLog()!.context) {
            <div class="flex flex-col gap-1">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_CONTEXT' | translate
              }}</span>
              <pre
                class="overflow-auto rounded-lg bg-surface-100 p-3 text-xs dark:bg-surface-900"
                >{{ selectedLog()!.context }}</pre
              >
            </div>
          }

          @if (selectedLog()!.stackTrace) {
            <div class="flex flex-col gap-1">
              <span class="text-sm text-surface-500">{{
                'ADMIN.LOG_VIEWER.COL_STACKTRACE' | translate
              }}</span>
              <pre
                class="overflow-auto rounded-lg bg-surface-100 p-3 text-xs dark:bg-surface-900"
                >{{ selectedLog()!.stackTrace }}</pre
              >
            </div>
          }
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
export class LogViewerComponent implements OnInit {
  private readonly logViewerFacade = inject(LogViewerFacade);

  protected readonly logs = this.logViewerFacade.logs;
  protected readonly totalCount = this.logViewerFacade.totalCount;
  protected readonly loading = this.logViewerFacade.loading;
  protected readonly selectedLog = signal<ClientLogDto | null>(null);

  protected selectedLevel: string | null = null;
  protected filterUserId = '';
  protected filterCorrelationId = '';
  protected filterFrom = '';
  protected filterTo = '';
  protected detailsDialogVisible = false;
  protected pageSize = ADMIN_LOGS_PAGE_SIZE;

  readonly levelOptions = [
    { label: 'Debug', value: 'debug' },
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warn' },
    { label: 'Error', value: 'error' },
    { label: 'Critical', value: 'critical' },
  ];

  ngOnInit(): void {
    this.logViewerFacade.enterPage();
  }

  protected onLazyLoad(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? this.pageSize;
    const page = event.first !== undefined ? Math.floor(event.first / rows) + 1 : 1;
    this.pageSize = rows;
    this.logViewerFacade.setPage(page, rows);
  }

  protected reload(): void {
    this.logViewerFacade.setLevelFilter(this.selectedLevel);
    this.logViewerFacade.setUserFilter(this.filterUserId);
    this.logViewerFacade.setCorrelationFilter(this.filterCorrelationId);
    this.logViewerFacade.setDateRange(this.filterFrom, this.filterTo);
  }

  protected clearFilters(): void {
    this.selectedLevel = null;
    this.filterUserId = '';
    this.filterCorrelationId = '';
    this.filterFrom = '';
    this.filterTo = '';
    this.logViewerFacade.clearFilters();
  }

  protected openDetails(log: ClientLogDto): void {
    this.selectedLog.set(log);
    this.detailsDialogVisible = true;
  }

  protected levelSeverity(level: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (level.toLowerCase()) {
      case 'debug':
        return 'secondary';
      case 'info':
        return 'info';
      case 'warn':
      case 'warning':
        return 'warn';
      case 'error':
        return 'danger';
      case 'critical':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
