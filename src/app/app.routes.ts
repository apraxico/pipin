import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 's/:id',
    loadComponent: () =>
      import('./pages/services/service-detail.component').then(m => m.ServiceDetailComponent)
  },

  // Auth
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./pages/auth/register.component').then(m => m.RegisterComponent)
  },

  // Zona privada
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile-edit.component').then(m => m.ProfileEditComponent)
  },
  {
    path: 'me/services',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/services/my-services.component').then(m => m.MyServicesComponent)
  },
  {
    path: 'me/favorites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  {
    path: 'services/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/services/service-edit.component').then(m => m.ServiceEditComponent)
  },
  {
    path: 'services/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/services/service-edit.component').then(m => m.ServiceEditComponent)
  },

  // Sólo dev: poblar la base con datos de muestra
  {
    path: 'admin/seed',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/seed.component').then(m => m.SeedComponent)
  },

  { path: '**', redirectTo: '' }
];
