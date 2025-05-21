import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'display',
    loadChildren: () => import('./photo-display/photo-display.module').then(m => m.PhotoDisplayModule)
  },
  {
    path: 'manage',
    loadChildren: () => import('./photo-management/photo-management.module').then(m => m.PhotoManagementModule)
  },
  {
    path: '',
    redirectTo: '/display',
    pathMatch: 'full'
  }
];
