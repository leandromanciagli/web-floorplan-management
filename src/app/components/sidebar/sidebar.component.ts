import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UsuarioService } from '@services/usuario/usuario.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sections = [
    {
      title: 'Usuarios',
      iconUrl: '/ico-usuarios.png',
      route: '/spa/usuarios',
      allowedRoles: ['SUPERADMIN', 'ADMINISTRADOR']
    },
    {
      title: 'Organizaciones',
      iconUrl: '/ico-organizaciones.png',
      route: '/spa/organizaciones',
      allowedRoles: ['SUPERADMIN', 'ADMINISTRADOR']
    },
    {
      title: 'Proyectos',
      iconUrl: '/ico-edificios.png',
      route: '/spa/listado-proyectos',
      allowedRoles: ['SUPERADMIN', 'CARGA_DE_PLANOS']
    },
    {
      title: 'Nuevo Proyecto',
      iconUrl: '/ico-plans.png',
      route: '/spa/nuevo-proyecto',
      allowedRoles: ['SUPERADMIN', 'CARGA_DE_PLANOS']
    },
  ]

  loggedUser: any

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loggedUser = this.usuarioService.getLoggedUser()
  }

  get getSectionsByRol(): Array<any> {
    return this.sections.filter(section => section.allowedRoles.includes(this.loggedUser.rolId));  
  }
}
