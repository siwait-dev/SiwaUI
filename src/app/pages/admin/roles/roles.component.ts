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
import { ToastModule } from 'primeng/toast';
import { RoleClaimDto } from '../../../core/store/roles/roles.models';
import { RolesFacade } from '../../../core/store/roles/roles.facade';

@Component({
  selector: 'app-roles',
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

        @if (visibleClaimsError()) {
          <p-message
            severity="error"
            [text]="visibleClaimsError()! | translate"
            styleClass="w-full"
          />
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
  private readonly rolesFacade = inject(RolesFacade);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  protected readonly roles = this.rolesFacade.roles;
  protected readonly selectedRole = this.rolesFacade.selectedRole;
  protected readonly claims = this.rolesFacade.claims;
  protected readonly loading = this.rolesFacade.loading;
  protected readonly saving = this.rolesFacade.saving;
  protected readonly claimsLoading = this.rolesFacade.claimsLoading;
  protected readonly claimSaving = this.rolesFacade.claimSaving;
  protected readonly createError = this.rolesFacade.createError;
  protected readonly claimsError = this.rolesFacade.claimsError;
  protected readonly deletingClaimKey = this.rolesFacade.deletingClaimKey;
  protected readonly localClaimsError = signal<string | null>(null);
  protected readonly visibleClaimsError = computed(
    () => this.localClaimsError() ?? this.claimsError(),
  );

  protected createDialogVisible = false;
  protected claimsDialogVisible = false;
  protected newRoleName = '';
  protected newClaimType = '';
  protected newClaimValue = '';

  constructor() {
    effect(() => {
      const feedback = this.rolesFacade.feedback();
      if (!feedback) return;

      const severity = feedback.kind === 'role-delete-failed' ? 'error' : 'success';
      const summaryKey =
        feedback.kind === 'role-created'
          ? 'ADMIN.ROLES.MESSAGES.CREATED'
          : feedback.kind === 'role-deleted'
            ? 'ADMIN.ROLES.MESSAGES.DELETED'
            : feedback.kind === 'claim-added'
              ? 'ADMIN.ROLES.MESSAGES.CLAIM_ADDED'
              : feedback.kind === 'claim-removed'
                ? 'ADMIN.ROLES.MESSAGES.CLAIM_REMOVED'
                : (feedback.messageKey ?? 'ADMIN.ROLES.ERRORS.DELETE_FAILED');

      if (feedback.kind === 'role-created') {
        this.createDialogVisible = false;
        this.newRoleName = '';
      }

      if (feedback.kind === 'claim-added') {
        this.newClaimType = '';
        this.newClaimValue = '';
      }

      this.messageService.add({
        severity,
        summary: this.translate.instant(summaryKey),
      });

      this.rolesFacade.consumeFeedback();
    });
  }

  ngOnInit(): void {
    this.rolesFacade.enterPage();
  }

  protected openCreateDialog(): void {
    this.newRoleName = '';
    this.rolesFacade.clearCreateError();
    this.createDialogVisible = true;
  }

  protected createRole(): void {
    const roleName = this.newRoleName.trim();
    if (!roleName) return;

    this.rolesFacade.createRole(roleName);
  }

  protected confirmDelete(role: string): void {
    this.confirmationService.confirm({
      message: this.translate.instant('ADMIN.ROLES.CONFIRM_DELETE', { role }),
      accept: () => this.rolesFacade.deleteRole(role),
    });
  }

  protected openClaimsDialog(role: string): void {
    this.claimsDialogVisible = true;
    this.newClaimType = '';
    this.newClaimValue = '';
    this.localClaimsError.set(null);
    this.rolesFacade.clearClaimsError();
    this.rolesFacade.openClaimsDialog(role);
  }

  protected addClaim(): void {
    const role = this.selectedRole();
    const type = this.newClaimType.trim();
    const value = this.newClaimValue.trim();

    if (!role || !type || !value) {
      this.localClaimsError.set('ADMIN.ROLES.ERRORS.CLAIM_REQUIRED');
      return;
    }

    this.localClaimsError.set(null);
    this.rolesFacade.addClaim(role, type, value);
  }

  protected removeClaim(claim: RoleClaimDto): void {
    const role = this.selectedRole();
    if (!role) return;

    this.localClaimsError.set(null);
    this.rolesFacade.removeClaim(role, claim);
  }

  protected isDeletingClaim(claim: RoleClaimDto): boolean {
    return this.deletingClaimKey() === this.claimKey(claim);
  }

  protected resetClaimsDialog(): void {
    this.claimsDialogVisible = false;
    this.rolesFacade.closeClaimsDialog();
    this.localClaimsError.set(null);
    this.newClaimType = '';
    this.newClaimValue = '';
  }

  private claimKey(claim: RoleClaimDto): string {
    return `${claim.type}::${claim.value}`;
  }
}
