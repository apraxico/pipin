import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const auth = inject(Auth);
  const router = inject(Router);
  return authState(auth).pipe(
    take(1),
    map(user => (user ? true : router.createUrlTree(['/auth/login'])))
  );
};
