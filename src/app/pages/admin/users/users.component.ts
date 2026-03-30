import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SiwaDatePipe } from '../../../../../projects/siwa-ui/src/lib/pipes/siwa-date.pipe';
import { UserDto } from '../../../core/store/users/users.models';
import { UsersFacade } from '../../../core/store/users/users.facade';

@Component({
  selector: 'app-users',
  imports: [
    TranslateModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    DialogModule,
    CheckboxModule,
    FormsModule,
    InputTextModule,
    MessageModule,
    SelectModule,
    SiwaDatePipe,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ 'ADMIN.USERS.TITLE' | translate }}</h1>
      </div>

      <p-card>
        <div class="mb-4 flex flex-wrap gap-3">
          <input
            pInputText
            [(ngModel)]="searchValue"
            (ngModelChange)="onSearch()"
            [placeholder]="'ADMIN.USERS.SEARCH_PLACEHOLDER' | translate"
            class="w-full max-w-sm"
          />
          <p-select
            [options]="statusOptions"
            [optionLabel]="'label'"
            optionValue="value"
            [(ngModel)]="selectedStatus"
            [placeholder]="'ADMIN.USERS.STATUS_FILTER' | translate"
            [showClear]="true"
            (ngModelChange)="onStatusFilterChange()"
            class="w-full md:w-56"
          >
            <ng-template let-option pTemplate="item">
              {{ option.label | translate }}
            </ng-template>
            <ng-template let-option pTemplate="selectedItem">
              {{ option.label | translate }}
            </ng-template>
          </p-select>
        </div>

        <p-table
          [value]="users()"
          [lazy]="true"
          [paginator]="true"
          [rows]="pageSize"
          [totalRecords]="totalCount()"
          [loading]="loading()"
          (onLazyLoad)="loadUsers($event)"
          dataKey="userId"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'ADMIN.USERS.COL_NAME' | translate }}</th>
              <th>{{ 'ADMIN.USERS.COL_EMAIL' | translate }}</th>
              <th>{{ 'ADMIN.USERS.COL_ROLES' | translate }}</th>
              <th>{{ 'COMMON.STATUS' | translate }}</th>
              <th>{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td>
                <div class="flex flex-col gap-1">
                  <span>{{ user.firstName }} {{ user.lastName }}</span>
                  <small class="text-surface-500">
                    {{ 'ADMIN.USERS.CREATED_AT' | translate }}:
                    {{ user.createdAt | siwaDate: 'dateTime' }}
                  </small>
                </div>
              </td>
              <td>
                <div class="flex flex-col gap-1">
                  <span>{{ user.email }}</span>
                  @if (user.emailConfirmed) {
                    <p-tag [value]="'ADMIN.USERS.EMAIL_CONFIRMED' | translate" severity="success" />
                  } @else {
                    <p-tag [value]="'ADMIN.USERS.EMAIL_PENDING' | translate" severity="warn" />
                  }
                </div>
              </td>
              <td>
                <div class="flex gap-1 flex-wrap">
                  @for (role of user.roles; track role) {
                    <p-tag [value]="role" severity="info" />
                  }
                  @if (user.roles.length === 0) {
                    <span class="text-surface-400 text-sm">â€”</span>
                  }
                </div>
              </td>
              <td>
                @if (user.isActive) {
                  <p-tag [value]="'ADMIN.USERS.STATUS_ACTIVE' | translate" severity="success" />
                } @else {
                  <p-tag [value]="'ADMIN.USERS.STATUS_INACTIVE' | translate" severity="danger" />
                }
              </td>
              <td>
                <div class="flex flex-wrap gap-2">
                  <p-button
                    [label]="'ADMIN.USERS.DETAILS' | translate"
                    icon="pi pi-eye"
                    severity="secondary"
                    size="small"
                    [outlined]="true"
                    (onClick)="openDetailsDialog(user)"
                  />
                  <p-button
                    [label]="'ADMIN.USERS.MANAGE_ROLES' | translate"
                    icon="pi pi-shield"
                    severity="secondary"
                    size="small"
                    (onClick)="openRolesDialog(user)"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center py-6 text-surface-500">
                {{ 'ADMIN.USERS.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <p-dialog
      [(visible)]="detailsDialogVisible"
      [header]="'ADMIN.USERS.DETAILS_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '520px' }"
    >
      @if (detailsUser()) {
        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'ADMIN.USERS.COL_NAME' | translate }}</span>
            <span>{{ detailsUser()!.firstName }} {{ detailsUser()!.lastName }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'ADMIN.USERS.COL_EMAIL' | translate }}</span>
            <span>{{ detailsUser()!.email }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'COMMON.STATUS' | translate }}</span>
            @if (detailsUser()!.isActive) {
              <p-tag [value]="'ADMIN.USERS.STATUS_ACTIVE' | translate" severity="success" />
            } @else {
              <p-tag [value]="'ADMIN.USERS.STATUS_INACTIVE' | translate" severity="danger" />
            }
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{
              'ADMIN.USERS.EMAIL_STATUS' | translate
            }}</span>
            @if (detailsUser()!.emailConfirmed) {
              <p-tag [value]="'ADMIN.USERS.EMAIL_CONFIRMED' | translate" severity="success" />
            } @else {
              <p-tag [value]="'ADMIN.USERS.EMAIL_PENDING' | translate" severity="warn" />
            }
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'ADMIN.USERS.CREATED_AT' | translate }}</span>
            <span>{{ detailsUser()!.createdAt | siwaDate: 'dateTime' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'ADMIN.USERS.LAST_LOGIN' | translate }}</span>
            <span>{{
              detailsUser()!.lastLoginAt
                ? (detailsUser()!.lastLoginAt! | siwaDate: 'dateTime')
                : ('ADMIN.USERS.NEVER_LOGGED_IN' | translate)
            }}</span>
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

    <!-- Roles dialog -->
    <p-dialog
      [(visible)]="rolesDialogVisible"
      [header]="'ADMIN.USERS.ROLES_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '400px' }"
      (onHide)="closeRolesDialog()"
    >
      @if (rolesDialogUser()) {
        <div class="flex flex-col gap-3">
          <p class="text-surface-500">{{ rolesDialogUser()!.email }}</p>

          @if (rolesLoading()) {
            <p class="text-surface-500 text-sm">{{ 'COMMON.LOADING' | translate }}</p>
          }

          @for (role of allRoles(); track role) {
            <div class="flex items-center gap-2">
              <p-checkbox
                [binary]="true"
                [ngModel]="hasRole(rolesDialogUser()!, role)"
                (ngModelChange)="toggleRole(rolesDialogUser()!, role, $event)"
                [inputId]="'role_' + role"
              />
              <label [for]="'role_' + role">{{ role }}</label>
            </div>
          }

          @if (rolesError()) {
            <p-message severity="error" [text]="rolesError()! | translate" styleClass="w-full" />
          }
        </div>
      }
      <ng-template pTemplate="footer">
        <p-button
          [label]="'COMMON.CLOSE' | translate"
          severity="secondary"
          (onClick)="rolesDialogVisible = false"
        />
      </ng-template>
    </p-dialog>
  `,
})
export class UsersComponent implements OnInit {
  private readonly usersFacade = inject(UsersFacade);

  protected readonly users = this.usersFacade.users;
  protected readonly totalCount = this.usersFacade.totalCount;
  protected readonly loading = this.usersFacade.loading;
  protected readonly allRoles = this.usersFacade.allRoles;
  protected readonly rolesDialogUser = this.usersFacade.rolesDialogUser;
  protected readonly rolesError = this.usersFacade.rolesError;
  protected readonly rolesLoading = this.usersFacade.rolesLoading;
  protected readonly detailsUser = signal<UserDto | null>(null);

  protected rolesDialogVisible = false;
  protected detailsDialogVisible = false;
  protected searchValue = '';
  protected selectedStatus: boolean | null = null;
  protected pageSize = 10;
  private currentPage = 1;
  private searchTimeout?: ReturnType<typeof setTimeout>;

  protected readonly statusOptions = [
    { label: 'ADMIN.USERS.STATUS_FILTER_ALL', value: null as boolean | null },
    { label: 'ADMIN.USERS.STATUS_ACTIVE', value: true },
    { label: 'ADMIN.USERS.STATUS_INACTIVE', value: false },
  ];

  ngOnInit(): void {
    this.usersFacade.enterPage();
  }

  protected loadUsers(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? this.pageSize;
    const page = event.first !== undefined ? Math.floor(event.first / rows) + 1 : 1;
    this.currentPage = page;
    this.pageSize = rows;
    this.usersFacade.setPage(page, rows);
  }

  protected onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.usersFacade.setSearch(this.searchValue), 300);
  }

  protected onStatusFilterChange(): void {
    this.usersFacade.setStatusFilter(this.selectedStatus);
  }

  protected openRolesDialog(user: UserDto): void {
    this.usersFacade.openRolesDialog(user);
    this.rolesDialogVisible = true;
  }

  protected openDetailsDialog(user: UserDto): void {
    this.detailsUser.set(user);
    this.detailsDialogVisible = true;
  }

  protected closeRolesDialog(): void {
    this.rolesDialogVisible = false;
    this.usersFacade.closeRolesDialog();
  }

  protected hasRole(user: UserDto, role: string): boolean {
    return user.roles.includes(role);
  }

  protected toggleRole(user: UserDto, role: string, checked: boolean): void {
    if (checked) {
      this.usersFacade.addUserRole(user.userId, role);
    } else {
      this.usersFacade.removeUserRole(user.userId, role);
    }
  }
}
