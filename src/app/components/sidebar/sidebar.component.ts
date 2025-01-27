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
      iconUrl: '/ico-organizacion.png',
      route: '/organizaciones',
    },
    {
      title: 'Gestionar planos',
      iconUrl: '/ico-organizacion.png',
      route: '/gestionar-planos',
    },
  ]
}
