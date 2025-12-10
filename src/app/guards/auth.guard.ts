import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../components/auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // Inyectar el servicio de autenticación y el router
  const authService = inject(AuthService);
  const router = inject(Router);

  // 🚨 Aquí está la verificación crítica
  if (authService.isLoggedIn()) {
    // 🟢 Si está logueado, permite el acceso.
    return true; 
  } else {
    // 🔴 Si NO está logueado:
    // 1. Redirige a la página de login.
    router.navigate(['/auth']); 
    // 2. Bloquea la ruta actual. ESTO ES CRUCIAL.
    return false; 
  }
};
