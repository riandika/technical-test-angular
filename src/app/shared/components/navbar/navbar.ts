import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { LoginResponse } from '../../../features/auth/_types/auth.types';
import { CartService } from '../../../core/services/cart.service';
import { CartDrawer } from '../cart-drawer/cart-drawer';

@Component({
  imports: [RouterLink, RouterLinkActive, CartDrawer],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  isProfileOpen = signal(false);
  user = signal<LoginResponse | null>(this.authStorage.getUser());
  isCartOpen = signal(false);

  toggleProfile(): void {
    this.isProfileOpen.update((value) => !value);
  }

  closeProfile(): void {
    this.isProfileOpen.set(false);
  }

  toggleCart(): void {
    this.isCartOpen.update((open) => !open);
  }

  logout(): void {
    this.isCartOpen.set(false);
    this.authStorage.clearSession();
    this.isProfileOpen.set(false);

    void this.router.navigate(['/login']);
  }
}
