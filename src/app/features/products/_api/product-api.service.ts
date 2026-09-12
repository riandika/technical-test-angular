import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductTypes } from '../_types/product.types';
import { API_CONFIG } from '../../../core/config/api.config';
import { API_ROUTES } from '../../../core/constants/api-routes';

@Service()
export class ProductApiService {
  private readonly http = inject(HttpClient);

  getProducts(
    params: ProductTypes.ProductQueryParams = {},
  ): Observable<ProductTypes.ProductResponse> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value);
      }
    });

    return this.http.get<ProductTypes.ProductResponse>(
      `${API_CONFIG.baseUrl}${API_ROUTES.products.list}`,
      { params: httpParams },
    );
  }

  getProductById(id: number): Observable<ProductTypes.Product> {
    return this.http.get<ProductTypes.Product>(
      `${API_CONFIG.baseUrl}${API_ROUTES.products.details(id)}`,
    );
  }
}
