import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ProductTypes } from '../../../features/products/_types/product.types';

@Component({
  imports: [CurrencyPipe],
  selector: 'product-list-component',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  readonly products = input<ProductTypes.Product[]>([]);
}
