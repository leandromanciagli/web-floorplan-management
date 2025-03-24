import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { showLoader, hideLoader } from '@components/loader/loader.actions';
import { Store, select } from '@ngrx/store';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '@services/usuario/usuario.service';
import { RolService } from '@services/roles/rol.service';
import { OrganizacionService } from '@services/organizacion/organizacion.service';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';
import { loaderSelector } from '@components/loader/loader.selectors';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbTooltip,
  ],
  providers: [
    UsuarioService,
    RolService,
    OrganizacionService,
    SweetAlertService,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  usuarios: any[] = [];
  roles: any[] = [];
  organizaciones: any[] = [];

  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    private swal: SweetAlertService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private organizacionService: OrganizacionService,
  ) { 
    this.loading$ = this.store.pipe(select(loaderSelector));
  }

  ngOnInit(): void {
    this.loadUsuarios()
    this.loadOrganizaciones()
    this.loadRoles()
  }

  async loadOrganizaciones() {
    this.store.dispatch(showLoader());
    this.organizacionService.getAll().subscribe(
      {
        next: (data) => {
          this.organizaciones = data;
          this.store.dispatch(hideLoader());
        },
        error: async (e) => {
          console.log(e);
          this.store.dispatch(hideLoader());
          await this.swal.displayErrorMessage()
        }
      }
    );
  }

  async loadRoles() {
    this.store.dispatch(showLoader());
    this.rolService.getAll().subscribe(
      {
        next: (data) => {
          this.roles = data;
          this.store.dispatch(hideLoader());
        },
        error: async (e) => {
          console.log(e);
          this.store.dispatch(hideLoader());
          await this.swal.displayErrorMessage()
        }
      }
    );
  }

  async loadUsuarios() {
    this.store.dispatch(showLoader());
    this.usuarioService.getAll().subscribe(
      {
        next: (data) => {
          this.usuarios = data;
          this.store.dispatch(hideLoader());
        },
        error: async (e) => {
          console.log(e);
          this.store.dispatch(hideLoader());
          await this.swal.displayErrorMessage()
        }
      }
    );
  }

  async deleteUsuario(usuario: any) {
    const userChoise = await this.swal.displayDeleteMessage("usuario")
    if (userChoise.isConfirmed) {
      this.store.dispatch(showLoader());
      this.usuarioService.delete(usuario.usuarioId).subscribe(
        {
          next: async () => {
            this.store.dispatch(hideLoader());
            await this.swal.displaySuccessMessage("Usuario eliminado")
            this.loadUsuarios()
          },
          error: async (e) => {
            console.log(e);
            this.store.dispatch(hideLoader());
            await this.swal.displayErrorMessage()
          }
        }
      );
    }
  }
}
