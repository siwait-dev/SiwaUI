import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public.routes').then(m => m.publicRoutes),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('./app-shell.routes').then(m => m.appShellRoutes),
  },
  {
    path: 'errors',
    children: [
      {
        path: '403',
        loadComponent: () =>
          import('./pages/errors/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
        title: '403 - Forbidden',
      },
      {
        path: '500',
        loadComponent: () =>
          import('./pages/errors/server-error/server-error.component').then(
            m => m.ServerErrorComponent,
          ),
        title: '500 - Server error',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/errors/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Not found',
  },
];
