import { Service } from '@angular/core';

import { LoginResponse } from '../../features/auth/_types/auth.types';

@Service()
export class AuthStorageService {
  private readonly accessTokenKey = 'davara_access_token';
  private readonly refreshTokenKey = 'davara_refresh_token';
  private readonly userKey = 'davara_user';

  setSession(response: LoginResponse): void {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);

    localStorage.setItem(
      this.userKey,
      JSON.stringify({
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      }),
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getUser(): string | null {
    return localStorage.getItem(this.userKey);
  }
  
  clearSession(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
