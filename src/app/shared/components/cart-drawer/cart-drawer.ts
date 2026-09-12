import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-cart-drawer',
  styleUrl: './cart-drawer.css',
  templateUrl: './cart-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDrawer {
  readonly isOpen = input(false);
  readonly closed = output<void>();

  readonly cartService = inject(CartService);

  close(): void {
    this.closed.emit();
  }

  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }
}
