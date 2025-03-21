import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  loggedUser: any

  sections = [
    {
      title: 'Usuarios',
      iconUrl: '/ico-usuarios.png',
      route: '/usuarios',
      allowedRoles: ['ADMINISTRADOR']
    },
    {
      title: 'Organizaciones',
      iconUrl: '/ico-organizaciones.png',
      route: '/organizaciones',
      allowedRoles: ['ADMINISTRADOR']
    },
    {
      title: 'Proyectos',
      iconUrl: '/ico-edificios.png',
      route: '/listado-proyectos',
      allowedRoles: ['CARGA_DE_PLANOS']
    },
    {
      title: 'Nuevo Proyecto',
      iconUrl: '/ico-plans.png',
      route: '/nuevo-proyecto',
      allowedRoles: ['CARGA_DE_PLANOS']
    },
  ]

  ngOnInit(): void {
    this.loggedUser = sessionStorage.getItem('loggedUser')
    this.loggedUser = JSON.parse(this.loggedUser)
  }

  get getSectionsByRol(): Array<any> {
    return this.sections.filter(section => section.allowedRoles.includes(this.loggedUser.rolId));  
  }
}
