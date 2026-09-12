import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../../core/constants/api-routes';
import { API_CONFIG } from '../../../core/config/api.config';
import { LoginRequest, LoginResponse, UserLookupResponse } from '../_types/auth.types';

@Service()
export class AuthApiService {
  private readonly http = inject(HttpClient);

  findUserByEmail(email: string): Observable<UserLookupResponse> {
    const params = new HttpParams().set('key', 'email').set('value', email);

    return this.http.get<UserLookupResponse>(`${API_CONFIG.baseUrl}${API_ROUTES.users.byEmail}`, {
      params,
    });
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_CONFIG.baseUrl}${API_ROUTES.auth.login}`, payload, {
      withCredentials: true,
    });
  }
}
