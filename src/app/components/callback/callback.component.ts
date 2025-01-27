import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-callback',
  template: `<p>Procesando inicio de sesión...</p>`,
  providers: [
    UsuarioService
  ],
})
export class CallbackComponent implements OnInit {
  constructor(private auth: AuthService, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    // this.auth.user$.subscribe((user) => {
    //   if (user) {
    //     console.log(user);
    //     console.log("HAY USUARIO");
    //     this.usuarioService.findByEmail("leandromanciagli@gmail.com").subscribe(
    //       {
    //         next: (data) => {
    //           console.log("ENCONTRO EL USUARIO EN LA BD");
    //           console.log(data);
    //         },
    //         error: async (e) => {
    //           console.log(e);
    //         }
    //       }
    //     );
        // const roles = user['https://your-app.com/roles'] || [];
        // if (roles.includes('admin')) {
        //   this.router.navigate(['/usuarios']);
        // } else if (roles.includes('user')) {
        //   this.router.navigate(['/organizaciones']);
        // } else {
        //   this.router.navigate(['/']);
        // }
      // }
    // });
  }
}
