import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AppSettingsEffects } from './core/store/app-settings/app-settings.effects';
import { appSettingsFeature } from './core/store/app-settings/app-settings.reducer';
import { AuditLogEffects } from './core/store/audit-log/audit-log.effects';
import { auditLogFeature } from './core/store/audit-log/audit-log.reducer';
import { ChangePasswordEffects } from './core/store/change-password/change-password.effects';
import { changePasswordFeature } from './core/store/change-password/change-password.reducer';
import { DashboardEffects } from './core/store/dashboard/dashboard.effects';
import { dashboardFeature } from './core/store/dashboard/dashboard.reducer';
import { LogViewerEffects } from './core/store/log-viewer/log-viewer.effects';
import { logViewerFeature } from './core/store/log-viewer/log-viewer.reducer';
import { PasswordPolicyEffects } from './core/store/password-policy/password-policy.effects';
import { passwordPolicyFeature } from './core/store/password-policy/password-policy.reducer';
import { ProfileEffects } from './core/store/profile/profile.effects';
import { profileFeature } from './core/store/profile/profile.reducer';
import { RolesEffects } from './core/store/roles/roles.effects';
import { rolesFeature } from './core/store/roles/roles.reducer';
import { ThemeSettingsEffects } from './core/store/theme-settings/theme-settings.effects';
import { themeSettingsFeature } from './core/store/theme-settings/theme-settings.reducer';
import { TranslationsEffects } from './core/store/translations/translations.effects';
import { translationsFeature } from './core/store/translations/translations.reducer';
import { UsersEffects } from './core/store/users/users.effects';
import { usersFeature } from './core/store/users/users.reducer';

export const appShellRoutes: Routes = [
  {
    path: '',
    providers: [provideState(themeSettingsFeature), provideEffects(ThemeSettingsEffects)],
    loadComponent: () =>
      import('./layout/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      {
        path: 'dashboard',
        providers: [provideState(dashboardFeature), provideEffects(DashboardEffects)],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard',
      },
      {
        path: 'profile',
        providers: [provideState(profileFeature), provideEffects(ProfileEffects)],
        loadComponent: () =>
          import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'My profile',
      },
      {
        path: 'change-password',
        providers: [provideState(changePasswordFeature), provideEffects(ChangePasswordEffects)],
        loadComponent: () =>
          import('./pages/change-password/change-password.component').then(
            m => m.ChangePasswordComponent,
          ),
        title: 'Change password',
      },
      {
        path: 'demo',
        loadComponent: () =>
          import('./pages/feature-demo/feature-demo.component').then(m => m.FeatureDemoComponent),
        title: 'Component demo',
      },
      {
        path: 'admin',
        children: [
          {
            path: 'users',
            providers: [provideState(usersFeature), provideEffects(UsersEffects)],
            loadComponent: () =>
              import('./pages/admin/users/users.component').then(m => m.UsersComponent),
            data: { requiredRoles: ['Admin'] },
            title: 'User management',
          },
          {
            path: 'roles',
            providers: [provideState(rolesFeature), provideEffects(RolesEffects)],
            loadComponent: () =>
              import('./pages/admin/roles/roles.component').then(m => m.RolesComponent),
            data: { requiredRoles: ['Admin'] },
            title: 'Role management',
          },
          {
            path: 'translations',
            providers: [provideState(translationsFeature), provideEffects(TranslationsEffects)],
            loadComponent: () =>
              import('./pages/admin/translations/translations.component').then(
                m => m.TranslationsComponent,
              ),
            data: { requiredRoles: ['Admin'] },
            title: 'Translations',
          },
          {
            path: 'theme',
            loadComponent: () =>
              import('./pages/admin/theme-settings/theme-settings.component').then(
                m => m.ThemeSettingsComponent,
              ),
            data: { requiredRoles: ['Admin'] },
            title: 'Theme settings',
          },
          {
            path: 'settings',
            providers: [provideState(appSettingsFeature), provideEffects(AppSettingsEffects)],
            loadComponent: () =>
              import('./pages/admin/app-settings/app-settings.component').then(
                m => m.AppSettingsComponent,
              ),
            data: { requiredRoles: ['Admin'] },
            title: 'App settings',
          },
          {
            path: 'audit',
            providers: [provideState(auditLogFeature), provideEffects(AuditLogEffects)],
            loadComponent: () =>
              import('./pages/admin/audit-log/audit-log.component').then(m => m.AuditLogComponent),
            data: { requiredRoles: ['Admin'] },
            title: 'Audit log',
          },
          {
            path: 'logs',
            providers: [provideState(logViewerFeature), provideEffects(LogViewerEffects)],
            loadComponent: () =>
              import('./pages/admin/log-viewer/log-viewer.component').then(
                m => m.LogViewerComponent,
              ),
            data: { requiredRoles: ['Admin'] },
            title: 'Log viewer',
          },
          {
            path: 'password-policy',
            providers: [provideState(passwordPolicyFeature), provideEffects(PasswordPolicyEffects)],
            loadComponent: () =>
              import('./pages/admin/password-policy/password-policy.component').then(
                m => m.PasswordPolicyComponent,
              ),
            data: { requiredRoles: ['Admin'] },
            title: 'Password policy',
          },
          { path: '', redirectTo: 'users', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
