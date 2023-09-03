import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthtenticatedGuard: CanActivateFn = (route, state) => {
  const router=inject(Router)
  const authService=inject(AuthService)

 if(authService.authStatus()===AuthStatus.authenticated){
   return true
 }
//  if(authService.authStatus()===AuthStatus.checking){
//   return false;
//  }
 router.navigateByUrl('/auth/login');
  return false;
};
