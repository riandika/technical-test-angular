import { computed, Service, signal } from '@angular/core';

import { ProductTypes } from '../../features/products/_types/product.types';

@Service()
export class CartService {
  private readonly cartItems = signal<ProductTypes.CartItem[]>([]);

  readonly items = this.cartItems.asReadonly();

  readonly totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  addItem(product: ProductTypes.Product, quantity = 1): void {
    if (product.stock <= 0 || quantity <= 0) {
      return;
    }

    this.cartItems.update((items) => {
      const existingItem = items.find((item) => item.product.id === product.id);

      if (!existingItem) {
        return [
          ...items,
          {
            product,
            quantity: Math.min(quantity, product.stock),
          },
        ];
      }

      return items.map((item) => {
        if (item.product.id !== product.id) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(item.quantity + quantity, product.stock),
        };
      });
    });
  }

  increaseQuantity(productId: number): void {
    this.cartItems.update((items) =>
      items.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(item.quantity + 1, item.product.stock),
        };
      }),
    );
  }

  decreaseQuantity(productId: number): void {
    this.cartItems.update((items) =>
      items
        .map((item) => {
          if (item.product.id !== productId) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  removeItem(productId: number): void {
    this.cartItems.update((items) => items.filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this.cartItems.set([]);
  }
}
