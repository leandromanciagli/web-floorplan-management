import { Routes } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { LoginComponent } from '@components/login/login.component';
import { OrganizacionComponent } from '@components/organizacion/organizacion.component';
import { UsuarioComponent } from '@components/usuario/usuario.component';
import { AuthGuard } from '@guards/auth.guard';
import { CallbackComponent } from '@components/callback/callback.component';
import { PlanoComponent } from '@components/plano/plano.component';


export const routes: Routes =
    [
        { path: 'callback', component: CallbackComponent },
        { 
            path: '', 
            component: HomeComponent, 
            canActivate: [AuthGuard],
            children: [
                { path: 'usuarios', component: UsuarioComponent },
                { path: 'organizaciones', component: OrganizacionComponent },
                { path: 'gestionar-planos', component: PlanoComponent },
            ]
        },
        { path: 'login', component: LoginComponent },
        { path: '**', redirectTo: '' },
    ];
