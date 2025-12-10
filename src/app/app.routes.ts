import { Routes } from '@angular/router';
import DashboardComponent from './components/dashboard/dashboard.component';
import AuthComponent from './components/auth/auth.component';
import CrudComponent from './components/crud/crud.component';
import { authGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [

    // 1. RUTA PÚBLICA (LOGIN)
    // Se carga directamente en el router-outlet de app.component.html (Pantalla Completa)
    { 
        path: 'auth', 
        component: AuthComponent 
    },
    
    // 2. RUTAS PROTEGIDAS (LAYOUT CON SIDEBAR Y NAVBAR)
    {
        path: '', // Esta es la ruta base protegida (ej: http://localhost:4200/)
        component: MainLayoutComponent, // El componente con el Header y Sidebar
        canActivate: [authGuard], // Protege TODAS las rutas hijas
        children: [
            // Carga por defecto: Redirige al dashboard
            {
                path: '', 
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            // Vistas que se cargan dentro del MainLayoutComponent's <router-outlet>
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'crud', 
                component: CrudComponent,
            },
            {
                path: 'perfil', 
                component: PerfilComponent,
            },
            // ... (Otras rutas protegidas)
        ]
    },
    
    // 3. RUTA WILDCARD
    { 
        path: '**', 
        redirectTo: 'auth' 
    }
    // {path:'', component:DashboardComponent},    
    // {path:'auth', component:AuthComponent},
    // {path:'crud', component:CrudComponent},    
    // {path:'', redirectTo:'', pathMatch:'full'}
];
