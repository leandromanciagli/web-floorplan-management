import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { showLoader, hideLoader } from '@components/loader/loader.actions';
import { Store, select } from '@ngrx/store';
import { UsuarioService } from '@services/usuario/usuario.service';
import { RolService } from '@services/roles/rol.service';
import { OrganizacionService } from '@services/organizacion/organizacion.service';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';
import { loaderSelector } from '@components/loader/loader.selectors';
import { AuthService } from '@auth0/auth0-angular';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    UsuarioService,
    RolService,
    OrganizacionService,
    SweetAlertService,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  usuarioForm = new FormGroup({
    sub: new FormControl('', [Validators.required]),
    nombreYapellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    dni: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    rol: new FormControl('', [Validators.required]),
    organizacion: new FormControl(''),
    profilePicture: new FormControl(''),
  });

  roles: any[] = [];
  organizaciones: any[] = [];
  loading$: Observable<boolean>;
  readonlyEmail: boolean = false;
  isUpdate!: boolean;
  loggedUser: any | null = null;

  constructor(
    private store: Store,
    private swal: SweetAlertService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private organizacionService: OrganizacionService,
    public authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) { 
    this.loading$ = this.store.pipe(select(loaderSelector));
  }

  ngOnInit(): void {
    this.store.dispatch(showLoader());

    this.route.queryParamMap.subscribe(params => {
      this.isUpdate = Boolean(params.get('isUpdate'));
    });

    if (this.isUpdate) {
      this.loggedUser = this.usuarioService.getLoggedUser()
      this.usuarioForm.patchValue({
        sub: this.loggedUser.sub,
        nombreYapellido: this.loggedUser.nombreYapellido,
        dni: this.loggedUser.dni,
        email: this.loggedUser.email,
        telefono: this.loggedUser.telefono,
        rol: this.loggedUser.rolId,
        organizacion: this.loggedUser.organizacionId,
        profilePicture: this.loggedUser.profilePicture,
      })
      this.email.disable()
      this.rol.disable()
      this.organizacion.disable()
    } else {
      this.authService.user$.subscribe((auth0User) => {
        if (auth0User) {
          this.usuarioForm.patchValue({
            nombreYapellido: auth0User.name,
            sub: auth0User.sub,
            profilePicture: auth0User.picture,
          })
          if (auth0User.email) {
            this.usuarioForm.patchValue({
              email: auth0User.email,
            })
            this.readonlyEmail = true;
          }
        }
      });
    }

    this.usuarioForm.get('rol')?.valueChanges.subscribe((rol) => {
      if (rol === 'CARGA_DE_PLANOS') {
        this.usuarioForm.get('organizacion')?.setValidators([Validators.required]);
      } else {
        this.usuarioForm.get('organizacion')?.clearValidators();
      }
      this.usuarioForm.get('organizacion')?.updateValueAndValidity();
      this.usuarioForm.get('organizacion')?.setValue('')
    });

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

  manageUsuario() {
    let usuario = {
      nombreYapellido: this.usuarioForm.value.nombreYapellido,
      email: this.usuarioForm.value.email,
      dni: this.usuarioForm.value.dni,
      organizacionId: this.usuarioForm.value.organizacion,
      rolId: this.usuarioForm.value.rol,
      telefono: this.usuarioForm.value.telefono,
      sub: this.usuarioForm.value.sub,
      profilePicture: this.usuarioForm.value.profilePicture,
    }
    this.store.dispatch(showLoader());
    if (this.isUpdate) {
      this.usuarioService.update(this.loggedUser.usuarioId, usuario).subscribe(
        {
        next: async (updatedUser) => {
            console.log(updatedUser);
            this.store.dispatch(hideLoader());
            sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
            this.loggedUser = this.usuarioService.getLoggedUser()
            this.usuarioForm.patchValue({
              sub: this.loggedUser.sub,
              nombreYapellido: this.loggedUser.nombreYapellido,
              dni: this.loggedUser.dni,
              email: this.loggedUser.email,
              telefono: this.loggedUser.telefono,
              rol: this.loggedUser.rolId,
              organizacion: this.loggedUser.organizacionId,
              profilePicture: this.loggedUser.profilePicture,
            })
            await this.swal.displaySuccessMessage("Perfil actualizado correctamente")
          },
          error: async (e) => {
            this.store.dispatch(hideLoader());
            await this.swal.displayErrorMessage("No se pudieron completar los datos perfil", "Por favor, intentá nuevamente")
          }
        }
      )
    } else {
      this.usuarioService.create(usuario).subscribe(
        {
          next: async () => {
            this.store.dispatch(hideLoader());
            await this.swal.displaySuccessMessage("Perfil completado correctamente")
            this.resetUsuarioForm()
            this.router.navigate(['/callback']);
          },
          error: async (e) => {
            console.log(e);
            this.store.dispatch(hideLoader());
            await this.swal.displayErrorMessage("No se pudieron completar los datos perfil", "Por favor, intentá nuevamente")
          }
        }
      )
    }
  }

  resetUsuarioForm() {
    this.usuarioForm = new FormGroup({
      sub: new FormControl('', [Validators.required]),
      nombreYapellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
      dni: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      rol: new FormControl('', [Validators.required]),
      organizacion: new FormControl(''),
      profilePicture: new FormControl(''),
    });
  }

  get nombreYapellido() {
    return this.usuarioForm.get('nombreYapellido')!;
  }

  get rol() {
    return this.usuarioForm.get('rol')!;
  }

  get email() {
    return this.usuarioForm.get('email')!;
  }

  get dni() {
    return this.usuarioForm.get('dni')!;
  }

  get organizacion() {
    return this.usuarioForm.get('organizacion')!;
  }

  get telefono() {
    return this.usuarioForm.get('telefono')!;
  }

  get profilePicture() {
    return this.usuarioForm.get('profilePicture')!;
  }

}
