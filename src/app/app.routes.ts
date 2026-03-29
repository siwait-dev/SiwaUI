import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ─── Public / Auth pages ──────────────────────────────────────────────────
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing/landing.component').then(m => m.LandingComponent),
        title: 'SiwaUI — Welcome',
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        title: 'Sign in',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.component').then(m => m.RegisterComponent),
        title: 'Create account',
      },
      {
        path: 'activate',
        loadComponent: () =>
          import('./pages/activate/activate.component').then(m => m.ActivateComponent),
        title: 'Activate account',
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password.component').then(
            m => m.ForgotPasswordComponent,
          ),
        title: 'Forgot password',
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/reset-password/reset-password.component').then(
            m => m.ResetPasswordComponent,
          ),
        title: 'Reset password',
      },
    ],
  },

  // ─── Authenticated / App pages ────────────────────────────────────────────
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'My profile',
      },
      {
        path: 'change-password',
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

      // ─── Admin ──────────────────────────────────────────────────────────
      {
        path: 'admin',
        children: [
          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/users/users.component').then(m => m.UsersComponent),
            title: 'User management',
          },
          {
            path: 'roles',
            loadComponent: () =>
              import('./pages/admin/roles/roles.component').then(m => m.RolesComponent),
            title: 'Role management',
          },
          {
            path: 'translations',
            loadComponent: () =>
              import('./pages/admin/translations/translations.component').then(
                m => m.TranslationsComponent,
              ),
            title: 'Translations',
          },
          {
            path: 'theme',
            loadComponent: () =>
              import('./pages/admin/theme-settings/theme-settings.component').then(
                m => m.ThemeSettingsComponent,
              ),
            title: 'Theme settings',
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./pages/admin/app-settings/app-settings.component').then(
                m => m.AppSettingsComponent,
              ),
            title: 'App settings',
          },
          {
            path: 'audit',
            loadComponent: () =>
              import('./pages/admin/audit-log/audit-log.component').then(m => m.AuditLogComponent),
            title: 'Audit log',
          },
          {
            path: 'logs',
            loadComponent: () =>
              import('./pages/admin/log-viewer/log-viewer.component').then(
                m => m.LogViewerComponent,
              ),
            title: 'Log viewer',
          },
          {
            path: 'password-policy',
            loadComponent: () =>
              import('./pages/admin/password-policy/password-policy.component').then(
                m => m.PasswordPolicyComponent,
              ),
            title: 'Password policy',
          },
          { path: '', redirectTo: 'users', pathMatch: 'full' },
        ],
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // ─── Error pages ──────────────────────────────────────────────────────────
  {
    path: 'errors',
    children: [
      {
        path: '403',
        loadComponent: () =>
          import('./pages/errors/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
        title: '403 — Forbidden',
      },
      {
        path: '500',
        loadComponent: () =>
          import('./pages/errors/server-error/server-error.component').then(
            m => m.ServerErrorComponent,
          ),
        title: '500 — Server error',
      },
    ],
  },

  // ─── Wildcard ─────────────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () =>
      import('./pages/errors/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 — Not found',
  },
];
