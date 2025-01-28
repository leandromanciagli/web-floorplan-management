import { Routes } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { LoginComponent } from '@components/login/login.component';
import { OrganizacionComponent } from '@components/organizacion/organizacion.component';
import { UsuarioComponent } from '@components/usuario/usuario.component';
import { AuthGuard } from '@guards/auth.guard';
import { CallbackComponent } from '@components/callback/callback.component';
import { ProyectoComponent } from '@components/proyecto/nuevo-proyecto/nuevo-proyecto.component';
import { ListadoProyectosComponent } from '@components/proyecto/listado-proyectos/listado-proyectos/listado-proyectos.component';


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
                { path: 'nuevo-proyecto', component: ProyectoComponent },
                { path: 'listado-proyectos', component: ListadoProyectosComponent },
            ]
        },
        { path: 'login', component: LoginComponent },
        { path: '**', redirectTo: '' },
    ];
