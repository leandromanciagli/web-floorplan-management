import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { loaderSelector } from '@components/loader/loader.selectors';
import { AuthService } from '@auth0/auth0-angular';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {

  loading$: Observable<boolean>;

  constructor(
    public store: Store,
    public router: Router,
    public authService: AuthService,
    public usuarioService: UsuarioService,
  ) { 
    this.loading$ = this.store.pipe(select(loaderSelector));
  }

  ngOnInit(): void 
  {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.authService.user$.subscribe((auth0User) => {
          if (auth0User) {
            this.usuarioService.findBySub(auth0User.sub!).subscribe(
              {
                next: (user) => {
                  if (user) {
                    sessionStorage.setItem('loggedUser', JSON.stringify(user));
                    let loggedUser = this.usuarioService.getLoggedUser()                    
                    if (loggedUser.rolId == 'ADMINISTRADOR' || loggedUser.rolId == 'SUPERADMIN') {
                      this.router.navigate(['/spa/usuarios']);
                    } else if (loggedUser.rolId == 'CARGA_DE_PLANOS') {
                      this.router.navigate(['/spa/listado-proyectos']);
                    }
                  } else {
                    this.router.navigate(['/profile']);
                  }
                },
                error: async (e) => {
                  console.log(e);
                }
              }
            );
          }
        });
      } else {
        this.router.navigate(['/login']);
      }
    })
  }
}
