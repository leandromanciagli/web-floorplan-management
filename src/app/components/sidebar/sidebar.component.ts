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
  sections = [
    // {
    //   title: 'Inicio',
    //   iconUrl: '/ico-inicio.png',
    //   route: '/',
    // },
    {
      title: 'Usuarios',
      iconUrl: '/ico-usuarios.png',
      route: '/usuarios',
    },
    {
      title: 'Organizaciones',
      iconUrl: '/ico-organizaciones.png',
      route: '/organizaciones',
    },
    {
      title: 'Nuevo Proyecto',
      iconUrl: '/ico-plans.png',
      route: '/nuevo-proyecto',
    },
    {
      title: 'Proyectos',
      iconUrl: '/ico-edificios.png',
      route: '/listado-proyectos',
    },
  ]
}
