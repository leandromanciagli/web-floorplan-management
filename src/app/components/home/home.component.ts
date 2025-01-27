import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UsuarioComponent } from '../usuario/usuario.component';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LoaderComponent,
    SidebarComponent,
    UserSettingsComponent,
    HomeComponent,
    UsuarioComponent,
    LoginComponent,
  ],
  providers: [
    NgbTooltipConfig,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private tooltipConfig: NgbTooltipConfig) { }

  ngOnInit(): void {
    this.tooltipConfig.triggers = 'hover'
  }
}
