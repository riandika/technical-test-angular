import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
            import(
                './features/auth/login/login'
            ).then((m) => m.Login)
    },
    {
        path: 'home',
        canActivate: [authGuard],  
        loadComponent: () =>
            import(
                './features/home/home/home'
            ).then((m) => m.Home)
    },
    {
        path: 'products',
        canActivate: [authGuard],
        loadComponent: () =>
            import(
                './features/products/product-list/product-list'
            ).then((m) => m.ProductList)
    },
    {
        path: 'products/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import(
                './features/products/product-detail/product-detail'
            ).then((m) => m.ProductDetail),
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
