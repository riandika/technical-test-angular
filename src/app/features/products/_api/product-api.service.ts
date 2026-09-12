import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductTypes } from '../_types/product.types';
import { API_CONFIG } from '../../../core/config/api.config';
import { API_ROUTES } from '../../../core/constants/api-routes';

@Service()
export class ProductApiService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<ProductTypes.ProductResponse> {
    return this.http.get<ProductTypes.ProductResponse>(
      `${API_CONFIG.baseUrl}${API_ROUTES.products.list}`,
    );
  }

  getProductById(id: number): Observable<ProductTypes.Product> {
    return this.http.get<ProductTypes.Product>(
      `${API_CONFIG.baseUrl}${API_ROUTES.products.details(id)}`,
    );
  }
}
