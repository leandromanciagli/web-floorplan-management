import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/spa']);
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  login() {
    this.authService.loginWithRedirect({
      authorizationParams: {
        prompt: 'login',
      }
    })
  }
}
