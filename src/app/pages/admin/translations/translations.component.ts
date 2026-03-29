import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
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
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

interface TranslationRow {
  key: string;
  nl: string;
  en: string;
}

interface FlatTranslationsResponse {
  translations: Record<string, string>;
}

@Component({
  selector: 'app-translations',
  standalone: true,
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
        <h1 class="text-2xl font-bold">{{ 'TRANSLATIONS.TITLE' | translate }}</h1>
        <p-button
          [label]="'TRANSLATIONS.ADD' | translate"
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
            [placeholder]="'TRANSLATIONS.SEARCH_PLACEHOLDER' | translate"
            class="w-full max-w-sm"
          />
        </div>
        <p-table [value]="filteredRows()" [paginator]="true" [rows]="20" [loading]="loading()">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'TRANSLATIONS.COL_KEY' | translate }}</th>
              <th>{{ 'TRANSLATIONS.COL_NL' | translate }}</th>
              <th>{{ 'TRANSLATIONS.COL_EN' | translate }}</th>
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
                {{ 'TRANSLATIONS.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <p-dialog
      [(visible)]="editDialogVisible"
      [header]="'TRANSLATIONS.EDIT_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '500px' }"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-medium">{{ 'TRANSLATIONS.KEY_LABEL' | translate }}</label>
          <input pInputText [(ngModel)]="editKey" [disabled]="isEditing" class="w-full font-mono" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium">{{ 'TRANSLATIONS.MODULE_LABEL' | translate }}</label>
          <input pInputText [(ngModel)]="editModule" class="w-full" />
          <small class="text-surface-500">{{ 'TRANSLATIONS.MODULE_HINT' | translate }}</small>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium">{{ 'TRANSLATIONS.COL_NL' | translate }}</label>
          <textarea pTextarea [(ngModel)]="editNl" rows="3" class="w-full"></textarea>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium">{{ 'TRANSLATIONS.COL_EN' | translate }}</label>
          <textarea pTextarea [(ngModel)]="editEn" rows="3" class="w-full"></textarea>
        </div>
        @if (editError()) {
          <p-message severity="error" [text]="editError()!" styleClass="w-full" />
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
  private readonly api = inject(ApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  protected readonly rows = signal<TranslationRow[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editError = signal<string | null>(null);

  protected searchValue = '';
  protected editDialogVisible = false;
  protected editKey = '';
  protected editModule = '';
  protected editNl = '';
  protected editEn = '';
  protected isEditing = false;

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
    this.loadTranslations();
  }

  private loadTranslations(): void {
    this.loading.set(true);
    let nlData: Record<string, string> = {};
    let enData: Record<string, string> = {};

    this.api.get<FlatTranslationsResponse>('translations/nl/flat').subscribe({
      next: res => {
        nlData = res.translations ?? (res as unknown as Record<string, string>);
        this.api.get<FlatTranslationsResponse>('translations/en/flat').subscribe({
          next: res2 => {
            enData = res2.translations ?? (res2 as unknown as Record<string, string>);
            const keys = new Set([...Object.keys(nlData), ...Object.keys(enData)]);
            this.rows.set(
              Array.from(keys)
                .sort()
                .map(k => ({ key: k, nl: nlData[k] ?? '', en: enData[k] ?? '' })),
            );
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      },
      error: () => this.loading.set(false),
    });
  }

  protected openEditDialog(row: TranslationRow | null): void {
    this.editError.set(null);
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
      this.editError.set('Vul een sleutel in.');
      return;
    }

    if (!this.editNl.trim() && !this.editEn.trim()) {
      this.editError.set('Vul minimaal een Nederlandse of Engelse vertaling in.');
      return;
    }

    this.saving.set(true);
    this.editError.set(null);

    const saveNl$ = this.api.post<unknown>('translations', {
      key,
      languageCode: 'nl',
      value: this.editNl,
      module: module || null,
    });

    const saveEn$ = this.api.post<unknown>('translations', {
      key,
      languageCode: 'en',
      value: this.editEn,
      module: module || null,
    });

    forkJoin([saveNl$, saveEn$]).subscribe({
      next: () => {
        this.saving.set(false);
        this.editDialogVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Vertaling opgeslagen' });
        this.loadTranslations();
      },
      error: () => {
        this.saving.set(false);
        this.editError.set('Opslaan mislukt.');
      },
    });
  }

  protected confirmDelete(row: TranslationRow): void {
    this.confirmationService.confirm({
      message: `Vertaling "${row.key}" verwijderen voor Nederlands en Engels?`,
      accept: () => this.deleteTranslation(row),
    });
  }

  private deleteTranslation(row: TranslationRow): void {
    forkJoin([
      this.api.delete<unknown>(`translations/nl/${encodeURIComponent(row.key)}`),
      this.api.delete<unknown>(`translations/en/${encodeURIComponent(row.key)}`),
    ]).subscribe({
      next: () => {
        this.rows.set(this.rows().filter(existing => existing.key !== row.key));
        this.messageService.add({ severity: 'success', summary: 'Vertaling verwijderd' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Verwijderen mislukt' });
      },
    });
  }
}
