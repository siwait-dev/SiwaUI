import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TranslationRow } from '../../../core/store/translations/translations.models';
import { TranslationsFacade } from '../../../core/store/translations/translations.facade';

@Component({
  selector: 'app-translations',
  providers: [ConfirmationService, MessageService],
  imports: [
    TranslateModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    MessageModule,
    TextareaModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  template: `
    <p-toast />
    <p-confirmDialog />

    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ 'ADMIN.TRANSLATIONS.TITLE' | translate }}</h1>
        <p-button
          [label]="'ADMIN.TRANSLATIONS.ADD' | translate"
          icon="pi pi-plus"
          severity="primary"
          (onClick)="openEditDialog(null)"
        />
      </div>

      <p-card>
        <div class="mb-4">
          <input
            pInputText
            [(ngModel)]="searchValue"
            [placeholder]="'ADMIN.TRANSLATIONS.SEARCH_PLACEHOLDER' | translate"
            class="w-full max-w-sm"
          />
        </div>
        <p-table [value]="filteredRows()" [paginator]="true" [rows]="20" [loading]="loading()">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'ADMIN.TRANSLATIONS.COL_KEY' | translate }}</th>
              <th>{{ 'ADMIN.TRANSLATIONS.COL_NL' | translate }}</th>
              <th>{{ 'ADMIN.TRANSLATIONS.COL_EN' | translate }}</th>
              <th>{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td class="font-mono text-sm">{{ row.key }}</td>
              <td class="max-w-xs truncate text-sm">{{ row.nl }}</td>
              <td class="max-w-xs truncate text-sm">{{ row.en }}</td>
              <td>
                <div class="flex gap-1">
                  <p-button
                    icon="pi pi-pencil"
                    severity="secondary"
                    size="small"
                    [outlined]="true"
                    (onClick)="openEditDialog(row)"
                  />
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    [outlined]="true"
                    (onClick)="confirmDelete(row)"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="text-center py-6 text-surface-500">
                {{ 'ADMIN.TRANSLATIONS.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <p-dialog
      [(visible)]="editDialogVisible"
      [header]="'ADMIN.TRANSLATIONS.EDIT_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '500px' }"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-medium">{{ 'ADMIN.TRANSLATIONS.KEY_LABEL' | translate }}</label>
          <input pInputText [(ngModel)]="editKey" [disabled]="isEditing" class="w-full font-mono" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium">{{ 'ADMIN.TRANSLATIONS.MODULE_LABEL' | translate }}</label>
          <input pInputText [(ngModel)]="editModule" class="w-full" />
          <small class="text-surface-500">{{ 'ADMIN.TRANSLATIONS.MODULE_HINT' | translate }}</small>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium">{{ 'ADMIN.TRANSLATIONS.COL_NL' | translate }}</label>
          <textarea pTextarea [(ngModel)]="editNl" rows="3" class="w-full"></textarea>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium">{{ 'ADMIN.TRANSLATIONS.COL_EN' | translate }}</label>
          <textarea pTextarea [(ngModel)]="editEn" rows="3" class="w-full"></textarea>
        </div>
        @if (editError()) {
          <p-message severity="error" [text]="editError()! | translate" styleClass="w-full" />
        }
      </div>
      <ng-template pTemplate="footer">
        <p-button
          [label]="'COMMON.CANCEL' | translate"
          severity="secondary"
          (onClick)="editDialogVisible = false"
        />
        <p-button
          [label]="'COMMON.SAVE' | translate"
          severity="primary"
          [loading]="saving()"
          (onClick)="saveTranslation()"
        />
      </ng-template>
    </p-dialog>
  `,
})
export class TranslationsComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  protected readonly rows = this.translationsFacade.rows;
  protected readonly loading = this.translationsFacade.loading;
  protected readonly saving = this.translationsFacade.saving;
  protected readonly backendEditError = this.translationsFacade.editError;
  protected readonly localEditError = signal<string | null>(null);
  protected readonly editError = computed(() => this.localEditError() ?? this.backendEditError());

  protected searchValue = '';
  protected editDialogVisible = false;
  protected editKey = '';
  protected editModule = '';
  protected editNl = '';
  protected editEn = '';
  protected isEditing = false;

  constructor() {
    effect(() => {
      const feedback = this.translationsFacade.feedback();
      if (!feedback) return;

      const severity = feedback.kind === 'delete-failed' ? 'error' : 'success';
      const summaryKey =
        feedback.kind === 'saved'
          ? 'ADMIN.TRANSLATIONS.MESSAGES.SAVED'
          : feedback.kind === 'deleted'
            ? 'ADMIN.TRANSLATIONS.MESSAGES.DELETED'
            : (feedback.messageKey ?? 'ADMIN.TRANSLATIONS.ERRORS.DELETE_FAILED');

      if (feedback.kind === 'saved') {
        this.editDialogVisible = false;
      }

      this.messageService.add({
        severity,
        summary: this.translate.instant(summaryKey),
      });

      this.translationsFacade.consumeFeedback();
    });
  }

  protected filteredRows(): TranslationRow[] {
    if (!this.searchValue) return this.rows();
    const s = this.searchValue.toLowerCase();
    return this.rows().filter(
      r =>
        r.key.toLowerCase().includes(s) ||
        r.nl.toLowerCase().includes(s) ||
        r.en.toLowerCase().includes(s),
    );
  }

  ngOnInit(): void {
    this.translationsFacade.enterPage();
  }

  protected openEditDialog(row: TranslationRow | null): void {
    this.translationsFacade.clearEditError();
    this.localEditError.set(null);
    if (row) {
      this.editKey = row.key;
      this.editModule = '';
      this.editNl = row.nl;
      this.editEn = row.en;
      this.isEditing = true;
    } else {
      this.editKey = '';
      this.editModule = '';
      this.editNl = '';
      this.editEn = '';
      this.isEditing = false;
    }
    this.editDialogVisible = true;
  }

  protected saveTranslation(): void {
    const key = this.editKey.trim();
    const module = this.editModule.trim();

    if (!key) {
      this.localEditError.set('ADMIN.TRANSLATIONS.ERRORS.KEY_REQUIRED');
      return;
    }

    if (!this.editNl.trim() && !this.editEn.trim()) {
      this.localEditError.set('ADMIN.TRANSLATIONS.ERRORS.VALUE_REQUIRED');
      return;
    }

    this.localEditError.set(null);
    this.translationsFacade.saveTranslation({
      key,
      module,
      nl: this.editNl,
      en: this.editEn,
    });
  }

  protected confirmDelete(row: TranslationRow): void {
    this.confirmationService.confirm({
      message: this.translate.instant('ADMIN.TRANSLATIONS.CONFIRM_DELETE', { key: row.key }),
      accept: () => this.deleteTranslation(row),
    });
  }

  protected deleteTranslation(row: TranslationRow): void {
    this.translationsFacade.deleteTranslation(row);
  }
}
