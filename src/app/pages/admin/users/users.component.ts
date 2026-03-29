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
import { ApiService } from '../../../core/services/api.service';
import { SiwaDatePipe } from '../../../../../projects/siwa-ui/src/lib/pipes/siwa-date.pipe';

interface UserDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  emailConfirmed: boolean;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
}

interface UserListResponse {
  items: UserDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface UserRolesResponse {
  roles: string[];
}

@Component({
  selector: 'app-users',
  standalone: true,
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
        <h1 class="text-2xl font-bold">{{ 'USERS.TITLE' | translate }}</h1>
      </div>

      <p-card>
        <div class="mb-4 flex flex-wrap gap-3">
          <input
            pInputText
            [(ngModel)]="searchValue"
            (ngModelChange)="onSearch()"
            [placeholder]="'USERS.SEARCH_PLACEHOLDER' | translate"
            class="w-full max-w-sm"
          />
          <p-select
            [options]="statusOptions"
            [optionLabel]="'label'"
            optionValue="value"
            [(ngModel)]="selectedStatus"
            [placeholder]="'USERS.STATUS_FILTER' | translate"
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
              <th>{{ 'USERS.COL_NAME' | translate }}</th>
              <th>{{ 'USERS.COL_EMAIL' | translate }}</th>
              <th>{{ 'USERS.COL_ROLES' | translate }}</th>
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
                    {{ 'USERS.CREATED_AT' | translate }}:
                    {{ user.createdAt | siwaDate: 'dateTime' }}
                  </small>
                </div>
              </td>
              <td>
                <div class="flex flex-col gap-1">
                  <span>{{ user.email }}</span>
                  @if (user.emailConfirmed) {
                    <p-tag [value]="'USERS.EMAIL_CONFIRMED' | translate" severity="success" />
                  } @else {
                    <p-tag [value]="'USERS.EMAIL_PENDING' | translate" severity="warn" />
                  }
                </div>
              </td>
              <td>
                <div class="flex gap-1 flex-wrap">
                  @for (role of user.roles; track role) {
                    <p-tag [value]="role" severity="info" />
                  }
                  @if (user.roles.length === 0) {
                    <span class="text-surface-400 text-sm">—</span>
                  }
                </div>
              </td>
              <td>
                @if (user.isActive) {
                  <p-tag [value]="'USERS.STATUS_ACTIVE' | translate" severity="success" />
                } @else {
                  <p-tag [value]="'USERS.STATUS_INACTIVE' | translate" severity="danger" />
                }
              </td>
              <td>
                <div class="flex flex-wrap gap-2">
                  <p-button
                    [label]="'USERS.DETAILS' | translate"
                    icon="pi pi-eye"
                    severity="secondary"
                    size="small"
                    [outlined]="true"
                    (onClick)="openDetailsDialog(user)"
                  />
                  <p-button
                    [label]="'USERS.MANAGE_ROLES' | translate"
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
                {{ 'USERS.EMPTY' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <p-dialog
      [(visible)]="detailsDialogVisible"
      [header]="'USERS.DETAILS_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '520px' }"
    >
      @if (detailsUser()) {
        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'USERS.COL_NAME' | translate }}</span>
            <span>{{ detailsUser()!.firstName }} {{ detailsUser()!.lastName }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'USERS.COL_EMAIL' | translate }}</span>
            <span>{{ detailsUser()!.email }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'COMMON.STATUS' | translate }}</span>
            @if (detailsUser()!.isActive) {
              <p-tag [value]="'USERS.STATUS_ACTIVE' | translate" severity="success" />
            } @else {
              <p-tag [value]="'USERS.STATUS_INACTIVE' | translate" severity="danger" />
            }
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'USERS.EMAIL_STATUS' | translate }}</span>
            @if (detailsUser()!.emailConfirmed) {
              <p-tag [value]="'USERS.EMAIL_CONFIRMED' | translate" severity="success" />
            } @else {
              <p-tag [value]="'USERS.EMAIL_PENDING' | translate" severity="warn" />
            }
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'USERS.CREATED_AT' | translate }}</span>
            <span>{{ detailsUser()!.createdAt | siwaDate: 'dateTime' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-surface-500">{{ 'USERS.LAST_LOGIN' | translate }}</span>
            <span>{{
              detailsUser()!.lastLoginAt
                ? (detailsUser()!.lastLoginAt! | siwaDate: 'dateTime')
                : ('USERS.NEVER_LOGGED_IN' | translate)
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
      [header]="'USERS.ROLES_DIALOG_TITLE' | translate"
      [modal]="true"
      [style]="{ width: '400px' }"
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
            <p-message severity="error" [text]="rolesError()!" styleClass="w-full" />
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
  private readonly api = inject(ApiService);

  protected readonly users = signal<UserDto[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly loading = signal(true);
  protected readonly allRoles = signal<string[]>([]);
  protected readonly rolesDialogUser = signal<UserDto | null>(null);
  protected readonly rolesError = signal<string | null>(null);
  protected readonly rolesLoading = signal(false);
  protected readonly detailsUser = signal<UserDto | null>(null);

  protected rolesDialogVisible = false;
  protected detailsDialogVisible = false;
  protected searchValue = '';
  protected selectedStatus: boolean | null = null;
  protected pageSize = 10;
  private currentPage = 1;
  private searchTimeout?: ReturnType<typeof setTimeout>;

  protected readonly statusOptions = [
    { label: 'USERS.STATUS_FILTER_ALL', value: null as boolean | null },
    { label: 'USERS.STATUS_ACTIVE', value: true },
    { label: 'USERS.STATUS_INACTIVE', value: false },
  ];

  ngOnInit(): void {
    this.loadRoles();
    this.fetchUsers(1, this.pageSize, this.searchValue);
  }

  protected loadUsers(event: TableLazyLoadEvent): void {
    const page = event.first !== undefined ? Math.floor(event.first / this.pageSize) + 1 : 1;
    this.currentPage = page;
    this.fetchUsers(page, this.pageSize, this.searchValue);
  }

  protected onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.fetchUsers(1, this.pageSize, this.searchValue), 300);
  }

  protected onStatusFilterChange(): void {
    this.fetchUsers(1, this.pageSize, this.searchValue);
  }

  private fetchUsers(page: number, pageSize: number, search: string): void {
    this.loading.set(true);
    const params: Record<string, string | number | boolean> = { page, pageSize };
    if (search) params['search'] = search;
    if (this.selectedStatus !== null) params['isActive'] = this.selectedStatus;

    this.api.get<UserListResponse>('users', params).subscribe({
      next: res => {
        this.users.set(res.items);
        this.totalCount.set(res.totalCount);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private loadRoles(): void {
    this.api.get<{ roles: string[] }>('roles').subscribe({
      next: res => this.allRoles.set(res.roles),
    });
  }

  protected openRolesDialog(user: UserDto): void {
    this.rolesDialogUser.set({ ...user, roles: [] });
    this.rolesError.set(null);
    this.rolesLoading.set(true);
    this.rolesDialogVisible = true;

    this.api.get<UserRolesResponse>(`users/${user.userId}/roles`).subscribe({
      next: res => {
        const dialogUser = this.rolesDialogUser();
        if (!dialogUser) return;

        const updatedUser = { ...dialogUser, roles: [...(res.roles ?? [])] };
        this.rolesDialogUser.set(updatedUser);
        this.syncUserInList(updatedUser);
        this.rolesLoading.set(false);
      },
      error: () => {
        this.rolesLoading.set(false);
        this.rolesError.set('Rollen laden mislukt.');
      },
    });
  }

  protected openDetailsDialog(user: UserDto): void {
    this.detailsUser.set(user);
    this.detailsDialogVisible = true;
  }

  protected hasRole(user: UserDto, role: string): boolean {
    return user.roles.includes(role);
  }

  protected toggleRole(user: UserDto, role: string, checked: boolean): void {
    this.rolesError.set(null);
    if (checked) {
      this.api
        .post<unknown>(`users/${user.userId}/roles`, { userId: user.userId, roleName: role })
        .subscribe({
          next: () => {
            user.roles = [...user.roles, role];
            this.syncUserInList(user);
          },
          error: () => this.rolesError.set('Opslaan mislukt.'),
        });
    } else {
      this.api.delete<unknown>(`users/${user.userId}/roles/${role}`).subscribe({
        next: () => {
          user.roles = user.roles.filter(r => r !== role);
          this.syncUserInList(user);
        },
        error: () => this.rolesError.set('Verwijderen mislukt.'),
      });
    }
  }

  private syncUserInList(user: UserDto): void {
    const list = this.users();
    const idx = list.findIndex(u => u.userId === user.userId);
    if (idx < 0) return;

    const updated = [...list];
    updated[idx] = { ...updated[idx], ...user, roles: [...user.roles] };
    this.users.set(updated);

    if (this.detailsUser()?.userId === user.userId) {
      this.detailsUser.set(updated[idx]);
    }
  }
}
