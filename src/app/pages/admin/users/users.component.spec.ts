import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { UsersEffects } from '../../../core/store/users/users.effects';
import { usersFeature } from '../../../core/store/users/users.reducer';
import { UsersComponent } from './users.component';
import { ApiService } from '../../../core/services/api.service';
import { ApiErrorService } from '../../../core/services/api-error.service';

describe('UsersComponent', () => {
  const api = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };

  const apiError = {
    getMessageKey: vi.fn(),
  };

  const userListResponse = {
    items: [
      {
        userId: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        emailConfirmed: true,
        roles: ['Admin'],
        createdAt: '2026-03-29T12:00:00Z',
        lastLoginAt: '2026-03-29T13:00:00Z',
      },
    ],
    totalCount: 1,
    page: 1,
    pageSize: 10,
  };

  beforeEach(async () => {
    api.get.mockReset();
    api.post.mockReset();
    api.delete.mockReset();
    apiError.getMessageKey.mockReset();

    api.get.mockImplementation((url: string) => {
      if (url === 'roles') return of({ roles: ['Admin', 'Manager'] });
      if (url === 'users') return of(userListResponse);
      if (url === 'users/1/roles') return of({ roles: ['Admin'] });
      return of({});
    });
    api.post.mockReturnValue(of({}));
    api.delete.mockReturnValue(of({}));
    apiError.getMessageKey.mockReturnValue('ADMIN.USERS.ERRORS.ROLES_LOAD_FAILED');

    await TestBed.configureTestingModule({
      imports: [UsersComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(usersFeature),
        provideEffects(UsersEffects),
        { provide: ApiService, useValue: api },
        { provide: ApiErrorService, useValue: apiError },
      ],
    }).compileComponents();
  });

  it('loads roles and users on init', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    expect(api.get).toHaveBeenCalledWith('roles');
    expect(api.get).toHaveBeenCalledWith('users', { page: 1, pageSize: 10 });
    expect(fixture.componentInstance['users']()).toHaveLength(1);
    expect(fixture.componentInstance['allRoles']()).toEqual(['Admin', 'Manager']);
  });

  it('reloads users with the active status filter', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    api.get.mockClear();
    component['selectedStatus'] = true;

    component['onStatusFilterChange']();

    expect(api.get).toHaveBeenCalledWith('users', { page: 1, pageSize: 10, isActive: true });
  });

  it('debounces search and passes the search query to the API', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    api.get.mockClear();
    component['searchValue'] = 'admin';
    vi.useFakeTimers();

    component['onSearch']();
    vi.advanceTimersByTime(300);

    expect(api.get).toHaveBeenCalledWith('users', { page: 1, pageSize: 10, search: 'admin' });
    vi.useRealTimers();
  });

  it('loads the latest roles when opening the role dialog', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const user = userListResponse.items[0];
    component['openRolesDialog'](user);

    expect(api.get).toHaveBeenCalledWith('users/1/roles');
    expect(component['rolesDialogVisible']).toBe(true);
    expect(component['rolesDialogUser']()?.roles).toEqual(['Admin']);
  });

  it('adds a role and syncs the updated user in the list', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const user = { ...component['users']()[0], roles: ['Admin'] };
    component['toggleRole'](user, 'Manager', true);

    expect(api.post).toHaveBeenCalledWith('users/1/roles', {
      userId: '1',
      roleName: 'Manager',
    });
    expect(component['users']()[0].roles).toEqual(['Admin', 'Manager']);
  });

  it('removes a role and syncs the updated user in the list', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const user = { ...component['users']()[0], roles: ['Admin', 'Manager'] };
    component['toggleRole'](user, 'Manager', false);

    expect(api.delete).toHaveBeenCalledWith('users/1/roles/Manager');
    expect(component['users']()[0].roles).toEqual(['Admin']);
  });

  it('stores a mapped error key when loading user roles fails', () => {
    api.get.mockImplementation((url: string) => {
      if (url === 'roles') return of({ roles: ['Admin', 'Manager'] });
      if (url === 'users') return of(userListResponse);
      if (url === 'users/1/roles') return throwError(() => ({ status: 500 }));
      return of({});
    });
    apiError.getMessageKey.mockReturnValue('ADMIN.USERS.ERRORS.ROLES_LOAD_FAILED');

    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component['openRolesDialog'](userListResponse.items[0]);

    expect(component['rolesError']()).toBe('ADMIN.USERS.ERRORS.ROLES_LOAD_FAILED');
  });
});
