import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DarkThemeToggleComponent } from './common/dark-theme-toggle.component';
import { NavbarComponent } from './common/navbar.component';
import { SidebarService } from './common/services/sidebar';
import { SidebarComponent } from './common/sidebar.component';
import { SidebarItemGroupComponent } from './common/sidebar-item-group.component';
import { SidebarItemComponent } from './common/sidebar-item.component';
import { components } from './common/components';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterModule, 
    DarkThemeToggleComponent, NavbarComponent, SidebarComponent, SidebarItemGroupComponent, SidebarItemComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'dashboard';
  components = components;
  // Inyectamos el Router
  // Usamos 'public' para que sea accesible en el template
  constructor(readonly sidebarService: SidebarService, public router: Router) {}
  


  ngOnInit(): void {
    initFlowbite();
  }

  // Método simple para verificar si estamos en la ruta de autenticación
  isAuthRoute(): boolean {
    // Si la ruta comienza con '/auth' (ej: /auth o /auth/login), retorna true
    return this.router.url.startsWith('/auth'); 
  }
}
