import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import { ProductTypes } from '../../products/_types/product.types';
import { ProductApiService } from '../../products/_api/product-api.service';
import { ProductList } from '../../../shared/components/product-list/product-list';

@Component({
  imports: [RouterLink, ProductList, DecimalPipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit, OnDestroy {
  private readonly productsApi = inject(ProductApiService);

  readonly products = signal<ProductTypes.Product[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly currentSlide = signal(0);
  readonly slideDirection = signal<'next' | 'previous'>('next');

  private autoSlideInterval?: ReturnType<typeof setInterval>;

  readonly featuredProducts = computed(() =>
    [...this.products()]
      .sort((a, b) => (b.reviews.length || 0) - (a.reviews.length || 0))
      .slice(0, 4),
  );
  readonly homeProducts = computed(() => this.products().slice(0, 8));
  readonly activeProduct = computed(() => this.featuredProducts()[this.currentSlide()]);

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  nextSlide(): void {
    this.stopAutoSlide();
    const totalSlides = this.featuredProducts().length;

    if (!totalSlides) {
      return;
    }

    this.slideDirection.set('next');
    this.currentSlide.update((current) => (current + 1) % totalSlides);
    this.startAutoSlide();
  }

  previousSlide(): void {
    this.stopAutoSlide();
    const totalSlides = this.featuredProducts().length;

    if (!totalSlides) {
      return;
    }

    this.slideDirection.set('previous');

    this.currentSlide.update((current) => (current === 0 ? totalSlides - 1 : current - 1));
    this.startAutoSlide();
  }

  private startAutoSlide(): void {
    this.stopAutoSlide();

    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = undefined;
    }
  }

  private loadProducts(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.productsApi.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.isLoading.set(false);

        this.startAutoSlide();
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      },
    });
  }
}
