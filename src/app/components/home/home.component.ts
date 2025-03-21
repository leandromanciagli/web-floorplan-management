import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UsuarioComponent } from '../usuario/usuario.component';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { showLoader } from '@components/loader/loader.actions';
import { loaderSelector } from '@components/loader/loader.selectors';

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
    UsuarioService,
    NgbTooltipConfig,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    public router: Router,
    public authService: AuthService,
    public usuarioService: UsuarioService,
    public tooltipConfig: NgbTooltipConfig,
  ) { 
    this.loading$ = this.store.pipe(select(loaderSelector));
  }

  ngOnInit(): void {
    this.tooltipConfig.triggers = 'hover'

    this.store.dispatch(showLoader());
    this.authService.user$.subscribe((auth0User) => {

      if (auth0User) {

        interface UsuarioFilter {
          email?: string;
          telefono?: string;
          username?: string;
        }

        let filter: UsuarioFilter = {}

        if (auth0User['email']) filter.email = auth0User['email'];
        if (auth0User['telefono']) filter.telefono = auth0User['telefono'];
        if (auth0User['username']) filter.username = auth0User['username'];

        this.usuarioService.findByEmailTelefonoOrUsername(filter).subscribe(
          {
            next: (user) => {
              let loggedUser = { ...auth0User, ...user } as any
              sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));

              if (loggedUser.rolId == 'ADMINISTRADOR') {
                this.router.navigate(['/spa/usuarios']);
              } else if (loggedUser.rolId == 'CARGA_DE_PLANOS') {
                this.router.navigate(['/spa/listado-proyectos']);
              }
            },
            error: async (e) => {
              console.log(e);
            }
          }
        );
      }
    });
  }
}
