import '@angular/common/locales/global/es-AR';
import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { loaderReducer } from './components/loader/loader.reducer';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from './config/CustomDateParserFormatter';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AuthInterceptor } from './interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    { provide: LOCALE_ID, useValue: 'es-AR' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideStore({ loader: loaderReducer }),
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    provideAuth0({
      domain: 'dev-p28g3izr2lega4kf.us.auth0.com',
      clientId: 'KdoMJNZ3K4W5tuBWjplwlSH5kCy7t5pU',
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      authorizationParams: {
        redirect_uri: window.location.origin+'/callback',
        audience: 'https://127.0.0.1:3000', // Identifier de la API en Auth0
      },
    }),
  ]
};
