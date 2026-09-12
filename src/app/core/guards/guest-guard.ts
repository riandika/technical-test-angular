import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStorageService } from '../services/auth-storage.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  if (!authStorage.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
