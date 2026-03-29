import { Component, inject, OnInit, signal } from '@angular/core';
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
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../../../core/services/api.service';
import { ApiErrorService } from '../../../core/services/api-error.service';

interface RoleClaimsResponse {
  claims: RoleClaimDto[];
}

interface RoleClaimDto {
  type: string;
  value: string;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    TranslateModule,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    MessageModule,
  ],
  template: `
    <p-toast />
    <p-confirmDialog />

    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ 'ADMIN.ROLES.TITLE' | translate }}</h1>
        <p-button
          [label]="'ADMIN.ROLES.ADD' | translate"
          icon="pi pi-plus"
          severity="primary"
          (onClick)="openCreateDialog()"
        />
      </div>

      <p-card>
        <p-table [value]="roles()" [loading]="loading()">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'ADMIN.ROLES.COL_NAME' | translate }}</th>
              <th>{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-role>
            <tr>
              <td class="font-mono">{{ role }}</td>
              <td>
                <div class="flex gap-2">
                  <p-button
                    [label]="'ADMIN.ROLES.MANAGE_CLAIMS' | translate"
                    icon="pi pi-key"
                    severity="secondary"
                    size="small"
                    [outlined]="true"
                    (onClick)="openClaimsDialog(role)"
                  />
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    [outlined]="true"
                    (onClick)="confirmDelete(role)"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="2" class="text-center py-6 text-surface-500">
                {{ 'ADMIN.ROLES.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <p-dialog
      [(visible)]="createDialogVisible"
      [header]="'ADMIN.ROLES.CREATE_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '380px' }"
    >
      <div class="flex flex-col gap-3">
        <label class="font-medium">{{ 'ADMIN.ROLES.NAME_LABEL' | translate }}</label>
        <input pInputText [(ngModel)]="newRoleName" class="w-full" />
        @if (createError()) {
          <p-message severity="error" [text]="createError()! | translate" styleClass="w-full" />
        }
      </div>
      <ng-template pTemplate="footer">
        <p-button
          [label]="'COMMON.CANCEL' | translate"
          severity="secondary"
          (onClick)="createDialogVisible = false"
        />
        <p-button
          [label]="'COMMON.SAVE' | translate"
          severity="primary"
          [loading]="saving()"
          (onClick)="createRole()"
        />
      </ng-template>
    </p-dialog>

    <p-dialog
      [(visible)]="claimsDialogVisible"
      [header]="'ADMIN.ROLES.CLAIMS_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '720px' }"
      (onHide)="resetClaimsDialog()"
    >
      <div class="flex flex-col gap-4">
        @if (selectedRole()) {
          <div
            class="rounded-lg border border-surface-200 bg-surface-50 px-4 py-3 dark:border-surface-700 dark:bg-surface-900/40"
          >
            <p class="text-sm text-surface-500">
              {{ 'ADMIN.ROLES.SELECTED_ROLE' | translate }}
            </p>
            <p class="font-mono text-sm font-semibold">{{ selectedRole() }}</p>
          </div>
        }

        <div class="grid gap-3 md:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label class="font-medium">{{ 'ADMIN.ROLES.CLAIM_TYPE_LABEL' | translate }}</label>
            <input pInputText [(ngModel)]="newClaimType" class="w-full" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-medium">{{ 'ADMIN.ROLES.CLAIM_VALUE_LABEL' | translate }}</label>
            <input pInputText [(ngModel)]="newClaimValue" class="w-full" />
          </div>
        </div>

        <div class="flex justify-end">
          <p-button
            [label]="'ADMIN.ROLES.ADD_CLAIM' | translate"
            icon="pi pi-plus"
            severity="primary"
            [loading]="claimSaving()"
            (onClick)="addClaim()"
          />
        </div>

        @if (claimsError()) {
          <p-message severity="error" [text]="claimsError()! | translate" styleClass="w-full" />
        }

        <p-table [value]="claims()" [loading]="claimsLoading()">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'ADMIN.ROLES.CLAIM_TYPE' | translate }}</th>
              <th>{{ 'ADMIN.ROLES.CLAIM_VALUE' | translate }}</th>
              <th class="w-24">{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-claim>
            <tr>
              <td class="font-mono text-sm">{{ claim.type }}</td>
              <td class="font-mono text-sm">{{ claim.value }}</td>
              <td>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  [outlined]="true"
                  [loading]="isDeletingClaim(claim)"
                  (onClick)="removeClaim(claim)"
                />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="3" class="text-center py-6 text-surface-500">
                {{ 'ADMIN.ROLES.CLAIMS_EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      <ng-template pTemplate="footer">
        <p-button
          [label]="'COMMON.CLOSE' | translate"
          severity="secondary"
          (onClick)="claimsDialogVisible = false"
        />
      </ng-template>
    </p-dialog>
  `,
})
export class RolesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly apiError = inject(ApiErrorService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  protected readonly roles = signal<string[]>([]);
  protected readonly selectedRole = signal<string | null>(null);
  protected readonly claims = signal<RoleClaimDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly claimsLoading = signal(false);
  protected readonly claimSaving = signal(false);
  protected readonly createError = signal<string | null>(null);
  protected readonly claimsError = signal<string | null>(null);
  protected readonly deletingClaimKey = signal<string | null>(null);

  protected createDialogVisible = false;
  protected claimsDialogVisible = false;
  protected newRoleName = '';
  protected newClaimType = '';
  protected newClaimValue = '';

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.loading.set(true);
    this.api.get<{ roles: string[] }>('roles').subscribe({
      next: res => {
        this.roles.set(res.roles);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected openCreateDialog(): void {
    this.newRoleName = '';
    this.createError.set(null);
    this.createDialogVisible = true;
  }

  protected createRole(): void {
    if (!this.newRoleName.trim()) return;
    this.saving.set(true);
    this.createError.set(null);

    this.api.post<unknown>('roles', { name: this.newRoleName.trim() }).subscribe({
      next: () => {
        this.saving.set(false);
        this.createDialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('ADMIN.ROLES.MESSAGES.CREATED'),
        });
        this.loadRoles();
      },
      error: error => {
        this.saving.set(false);
        this.createError.set(
          this.apiError.getMessageKey(error, 'ADMIN.ROLES.ERRORS.CREATE_FAILED'),
        );
      },
    });
  }

  protected confirmDelete(role: string): void {
    this.confirmationService.confirm({
      message: this.translate.instant('ADMIN.ROLES.CONFIRM_DELETE', { role }),
      accept: () => this.deleteRole(role),
    });
  }

  protected openClaimsDialog(role: string): void {
    this.selectedRole.set(role);
    this.claimsDialogVisible = true;
    this.newClaimType = '';
    this.newClaimValue = '';
    this.claimsError.set(null);
    this.loadClaims(role);
  }

  protected addClaim(): void {
    const role = this.selectedRole();
    const type = this.newClaimType.trim();
    const value = this.newClaimValue.trim();

    if (!role || !type || !value) {
      this.claimsError.set('ADMIN.ROLES.ERRORS.CLAIM_REQUIRED');
      return;
    }

    this.claimSaving.set(true);
    this.claimsError.set(null);

    this.api
      .post<unknown>(`roles/${encodeURIComponent(role)}/claims`, {
        roleName: role,
        type,
        value,
      })
      .subscribe({
        next: () => {
          this.claimSaving.set(false);
          this.newClaimType = '';
          this.newClaimValue = '';
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('ADMIN.ROLES.MESSAGES.CLAIM_ADDED'),
          });
          this.loadClaims(role);
        },
        error: error => {
          this.claimSaving.set(false);
          this.claimsError.set(
            this.apiError.getMessageKey(error, 'ADMIN.ROLES.ERRORS.CLAIM_ADD_FAILED'),
          );
        },
      });
  }

  protected removeClaim(claim: RoleClaimDto): void {
    const role = this.selectedRole();
    if (!role) return;

    this.deletingClaimKey.set(this.claimKey(claim));
    this.claimsError.set(null);

    this.api
      .delete<unknown>(`roles/${encodeURIComponent(role)}/claims`, {
        roleName: role,
        type: claim.type,
        value: claim.value,
      })
      .subscribe({
        next: () => {
          this.deletingClaimKey.set(null);
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('ADMIN.ROLES.MESSAGES.CLAIM_REMOVED'),
          });
          this.claims.set(
            this.claims().filter(existing => this.claimKey(existing) !== this.claimKey(claim)),
          );
        },
        error: error => {
          this.deletingClaimKey.set(null);
          this.claimsError.set(
            this.apiError.getMessageKey(error, 'ADMIN.ROLES.ERRORS.CLAIM_REMOVE_FAILED'),
          );
        },
      });
  }

  private deleteRole(role: string): void {
    this.api.delete<unknown>(`roles/${role}`).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('ADMIN.ROLES.MESSAGES.DELETED'),
        });
        this.loadRoles();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant(
            this.apiError.getMessageKey(error, 'ADMIN.ROLES.ERRORS.DELETE_FAILED'),
          ),
        });
      },
    });
  }

  protected isDeletingClaim(claim: RoleClaimDto): boolean {
    return this.deletingClaimKey() === this.claimKey(claim);
  }

  protected resetClaimsDialog(): void {
    this.selectedRole.set(null);
    this.claims.set([]);
    this.claimsError.set(null);
    this.claimsLoading.set(false);
    this.claimSaving.set(false);
    this.deletingClaimKey.set(null);
    this.newClaimType = '';
    this.newClaimValue = '';
  }

  private loadClaims(role: string): void {
    this.claimsLoading.set(true);
    this.claimsError.set(null);

    this.api.get<RoleClaimsResponse>(`roles/${encodeURIComponent(role)}/claims`).subscribe({
      next: res => {
        this.claims.set(res.claims ?? []);
        this.claimsLoading.set(false);
      },
      error: error => {
        this.claimsLoading.set(false);
        this.claimsError.set(
          this.apiError.getMessageKey(error, 'ADMIN.ROLES.ERRORS.CLAIMS_LOAD_FAILED'),
        );
      },
    });
  }

  private claimKey(claim: RoleClaimDto): string {
    return `${claim.type}::${claim.value}`;
  }
}
