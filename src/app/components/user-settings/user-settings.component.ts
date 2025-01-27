import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

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

  constructor(public auth: AuthService) { }
  
  logout() {
    this.auth.logout({ logoutParams: { returnTo: 'http://localhost:4200/login' } });
  }
}
