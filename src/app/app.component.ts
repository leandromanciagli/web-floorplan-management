import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-root',
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


  constructor(public authService: AuthService, private tooltipConfig: NgbTooltipConfig) { }

  ngOnInit(): void {
    this.tooltipConfig.triggers = 'hover'

    this.authService.isAuthenticated$.subscribe((authStatus) => {
      console.log('Estado de autenticación:', authStatus);
    });
  }
}
