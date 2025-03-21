import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

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
  ) { }

  ngOnInit(): void {
    this.loggedUser = sessionStorage.getItem('loggedUser') 
    this.loggedUser = JSON.parse(this.loggedUser)
  }
  
  async logOut() {
    this.authService.logout();
  }
}
