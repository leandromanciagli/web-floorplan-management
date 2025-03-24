import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { UsuarioService } from '@services/usuario/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent {

  loggedUser: any

  constructor(
    public authService: AuthService,
    public usuarioService: UsuarioService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.usuarioService.getLoggedUser()
  }
  
  async logOut() {
    this.authService.logout();
  }
}
