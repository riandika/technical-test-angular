import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductTypes } from '../../../features/products/_types/product.types';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'product-list-component',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  readonly products = input<ProductTypes.Product[]>([]);
}
