import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { ProductTypes } from '../_types/product.types';
import { ProductApiService } from '../_api/product-api.service';
import { ProductList as ProductListComponent } from '../../../shared/components/product-list/product-list';

@Component({
  imports: [ProductListComponent],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private readonly productsApi = inject(ProductApiService);

  readonly products = signal<ProductTypes.Product[]>([]);
  readonly isLoading = signal(false);
  readonly isLoadingMore = signal(false);
  readonly hasError = signal(false);
  readonly total = signal(0);
  readonly skip = signal(0);
  readonly sortBy = signal<ProductTypes.SortBy | undefined>(undefined);
  readonly sortOrder = signal<ProductTypes.SortOrder | undefined>(undefined);

  readonly limit = 24;

  readonly hasProducts = computed(() => this.products().length > 0);
  readonly hasMore = computed(() => this.products().length < this.total());
  readonly productCountLabel = computed(
    () => `Showing ${this.products().length} of ${this.total()}`,
  );

  ngOnInit(): void {
    this.loadProducts();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    if (!value) {
      this.sortBy.set(undefined);
      this.sortOrder.set(undefined);
    } else {
      const [sortBy, order] = value.split('-') as [ProductTypes.SortBy, ProductTypes.SortOrder];

      this.sortBy.set(sortBy);
      this.sortOrder.set(order);
    }

    this.resetAndLoad();
  }

  loadMore(): void {
    if (this.isLoadingMore() || !this.hasMore()) {
      return;
    }

    const nextSkip = this.skip() + this.limit;

    this.isLoadingMore.set(true);

    this.productsApi
      .getProducts({
        limit: this.limit,
        skip: nextSkip,
        sortBy: this.sortBy(),
        order: this.sortOrder(),
      })
      .subscribe({
        next: (response) => {
          this.products.update((products) => [...products, ...response.products]);

          this.skip.set(nextSkip);
          this.total.set(response.total);
          this.isLoadingMore.set(false);
        },
        error: () => {
          this.isLoadingMore.set(false);
          this.hasError.set(true);
        },
      });
  }

  private resetAndLoad(): void {
    this.products.set([]);
    this.skip.set(0);
    this.total.set(0);

    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.productsApi
      .getProducts({
        limit: this.limit,
        skip: 0,
        sortBy: this.sortBy(),
        order: this.sortOrder(),
      })
      .subscribe({
        next: (response) => {
          this.products.set(response.products);
          this.total.set(response.total);
          this.skip.set(response.skip);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.hasError.set(true);
        },
      });
  }
}
