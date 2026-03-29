import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RolesComponent } from './roles.component';
import { ApiService } from '../../../core/services/api.service';

describe('RolesComponent', () => {
  const api = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    api.get.mockReset();
    api.post.mockReset();
    api.delete.mockReset();
    api.get.mockReturnValue(of({ roles: ['Admin'] }));

    await TestBed.configureTestingModule({
      imports: [RolesComponent, TranslateModule.forRoot()],
      providers: [{ provide: ApiService, useValue: api }, ConfirmationService, MessageService],
    }).compileComponents();
  });

  it('loads roles on init', () => {
    const fixture = TestBed.createComponent(RolesComponent);
    fixture.detectChanges();

    expect(api.get).toHaveBeenCalledWith('roles');
    expect(fixture.componentInstance['roles']()).toEqual(['Admin']);
  });

  it('sets a validation key when adding a claim without type and value', () => {
    const fixture = TestBed.createComponent(RolesComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component['selectedRole'].set('Admin');
    component['newClaimType'] = '';
    component['newClaimValue'] = '';

    component['addClaim']();

    expect(component['claimsError']()).toBe('ADMIN.ROLES.ERRORS.CLAIM_REQUIRED');
    expect(api.post).not.toHaveBeenCalledWith('roles/Admin/claims', expect.anything());
  });

  it('creates a role and reloads the list', () => {
    api.post.mockReturnValue(of({}));

    const fixture = TestBed.createComponent(RolesComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component['newRoleName'] = 'Manager';
    component['createRole']();

    expect(api.post).toHaveBeenCalledWith('roles', { name: 'Manager' });
    expect(api.get).toHaveBeenCalledTimes(2);
  });
});
