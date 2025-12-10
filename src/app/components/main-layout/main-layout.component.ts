import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DarkThemeToggleComponent } from '../../common/dark-theme-toggle.component'; 
import { NavbarComponent } from '../../common/navbar.component'; 
import { SidebarService } from '../../common/services'; 
import { SidebarComponent } from '../../common/sidebar.component'; 
import { SidebarItemGroupComponent } from '../../common/sidebar-item-group.component'; 
import { SidebarItemComponent } from '../../common/sidebar-item.component'; 
import { components } from '../../common/components'; 
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, DarkThemeToggleComponent, NavbarComponent, SidebarComponent, SidebarItemGroupComponent, SidebarItemComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  userFullName: string | null = null;
  userEmail: string | null = null;
  // 🟢 1. INYECTAR EL SERVICIO DE AUTENTICACIÓN
  public authService = inject(AuthService); // Hacerlo público para usarlo en el HTML
  components = components;
  constructor(readonly sidebarService: SidebarService, public router: Router) {}

   ngOnInit(): void {
    initFlowbite();

    this.userFullName=this.authService.getUserFullName();
    this.userEmail=this.authService.getUserEmail();
  }
  // 🟢 2. MÉTODO PARA EL EVENTO CLICK DEL BOTÓN
 onLogout() {
 // Llama al método del servicio que limpia el localStorage y redirige a /auth
 this.authService.signOut();
}
}
