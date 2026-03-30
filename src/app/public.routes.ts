import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ActivateEffects } from './core/store/activate/activate.effects';
import { activateFeature } from './core/store/activate/activate.reducer';
import { ForgotPasswordEffects } from './core/store/forgot-password/forgot-password.effects';
import { forgotPasswordFeature } from './core/store/forgot-password/forgot-password.reducer';
import { LoginEffects } from './core/store/login/login.effects';
import { loginFeature } from './core/store/login/login.reducer';
import { RegisterEffects } from './core/store/register/register.effects';
import { registerFeature } from './core/store/register/register.reducer';
import { ResetPasswordEffects } from './core/store/reset-password/reset-password.effects';
import { resetPasswordFeature } from './core/store/reset-password/reset-password.reducer';

export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing/landing.component').then(m => m.LandingComponent),
        title: 'SiwaUI - Welcome',
      },
      {
        path: 'login',
        providers: [provideState(loginFeature), provideEffects(LoginEffects)],
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        title: 'Sign in',
      },
      {
        path: 'register',
        providers: [provideState(registerFeature), provideEffects(RegisterEffects)],
        loadComponent: () =>
          import('./pages/register/register.component').then(m => m.RegisterComponent),
        title: 'Create account',
      },
      {
        path: 'activate',
        providers: [provideState(activateFeature), provideEffects(ActivateEffects)],
        loadComponent: () =>
          import('./pages/activate/activate.component').then(m => m.ActivateComponent),
        title: 'Activate account',
      },
      {
        path: 'forgot-password',
        providers: [provideState(forgotPasswordFeature), provideEffects(ForgotPasswordEffects)],
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password.component').then(
            m => m.ForgotPasswordComponent,
          ),
        title: 'Forgot password',
      },
      {
        path: 'reset-password',
        providers: [provideState(resetPasswordFeature), provideEffects(ResetPasswordEffects)],
        loadComponent: () =>
          import('./pages/reset-password/reset-password.component').then(
            m => m.ResetPasswordComponent,
          ),
        title: 'Reset password',
      },
    ],
  },
];
