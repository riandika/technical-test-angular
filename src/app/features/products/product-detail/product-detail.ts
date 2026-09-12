import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { switchMap } from 'rxjs';

import { ProductApiService } from '../_api/product-api.service';
import { ProductTypes } from '../_types/product.types';

@Component({
  imports: [CurrencyPipe, DecimalPipe, RouterLink, DatePipe],
  selector: 'app-product-detail',
  styleUrl: './product-detail.css',
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(ProductApiService);

  readonly product = signal<ProductTypes.Product | null>(null);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly quantity = signal(1);
  readonly selectedImage = signal(0);

  readonly isOutOfStock = computed(() => !this.product() || this.product()!.stock <= 0);
  readonly maxQuantity = computed(() => this.product()?.stock ?? 1);
  readonly activeImage = computed(() => {
    const product = this.product();

    if (!product) {
      return '';
    }

    return product.images[this.selectedImage()] || product.thumbnail;
  });

  ngOnInit(): void {
    this.loadProduct();
  }

  selectImage(index: number): void {
    this.selectedImage.set(index);
  }

  increaseQuantity(): void {
    const maxQuantity = this.maxQuantity();

    this.quantity.update((current) => (current < maxQuantity ? current + 1 : current));
  }

  decreaseQuantity(): void {
    this.quantity.update((current) => (current > 1 ? current - 1 : current));
  }

  private loadProduct(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));

          return this.productsApi.getProductById(id);
        }),
      )
      .subscribe({
        next: (product) => {
          this.product.set(product);
          this.quantity.set(1);
          this.selectedImage.set(0);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.hasError.set(true);
        },
      });
  }
}
