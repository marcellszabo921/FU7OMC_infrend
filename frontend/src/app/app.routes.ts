import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import AdminComponent from './pages/admin/admin.component';
import HomeComponent from './pages/home/home.component';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./pages/login/login.component') },
    { path: 'register', loadComponent: () => import('./pages/register/register.component') },
    { path: 'rent', loadComponent: () => import('./pages/rent/rent.component') },
    { path: 'contact', loadComponent: () => import('./pages/contact/contact.component') },
    { path: 'profile', loadComponent: () => import('./pages/profile/profile.component') },
    { path: 'about', loadComponent: () => import('./pages/about/about.component') },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },

    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: '**', redirectTo: 'home' } 
];
