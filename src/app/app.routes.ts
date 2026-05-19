import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { DashboardHome } from './components/dashboard-home/dashboard-home';
import { MapPage } from './components/map-page/map-page';
import { FavoritesPage } from './components/favorites-page/favorites-page';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardHome },
      { path: 'map', component: MapPage },
      { path: 'favorites', component: FavoritesPage },
    ],
  },
  { path: '**', redirectTo: '' },
];
