import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { showLoader, hideLoader } from '@components/loader/loader.actions';
import { Store, select } from '@ngrx/store';
import { NgbModal, NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
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
    NgbModal,
    NgbActiveModal,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  usuarioForm = new FormGroup({
    apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    rol: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    dni: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
    username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^\S+$/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&./ ])[A-Za-z\d@$!%*?&./ ]{8,20}$/)]),
    organizacion: new FormControl('', [Validators.required]),
  });

  usuarios: any[] = [];
  roles: any[] = [];
  organizaciones: any[] = [];
  usuarioIdSeleccionado = null;

  passwordEyeIcon = 'ico-eye-grey.png';
  inputPasswordType = 'password';

  loading$: Observable<boolean>;


  constructor(
    private store: Store,
    private swal: SweetAlertService,
    private modalService: NgbModal,
    private modalGestionUsuario: NgbActiveModal,
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

  manageUsuario() {
    let usuario = {
      apellido: this.usuarioForm.value.apellido,
      nombre: this.usuarioForm.value.nombre,
      username: this.usuarioForm.value.username,
      email: this.usuarioForm.value.email,
      dni: this.usuarioForm.value.dni,
      password: this.usuarioForm.value.password,
      organizacionId: this.usuarioForm.value.organizacion,
      rolId: this.usuarioForm.value.rol,
    }
    this.store.dispatch(showLoader());
    if (this.usuarioIdSeleccionado) {
      this.usuarioService.update(this.usuarioIdSeleccionado, usuario).subscribe(
        {
          next: async () => {
            this.store.dispatch(hideLoader());
            await this.swal.displaySuccessMessage("Usuario editado correctamente")
            this.closeModalGestionUsuario()
            this.loadUsuarios()
          },
          error: async (e) => {
            this.store.dispatch(hideLoader());
            await this.swal.displayErrorMessage("No se pudo editar el usuario", e.error.error.message)
          }
        }
      )
    } else {
      this.usuarioService.create(usuario).subscribe(
        {
          next: async () => {
            this.store.dispatch(hideLoader());
            await this.swal.displaySuccessMessage("Usuario creado correctamente")
            this.closeModalGestionUsuario()
            this.loadUsuarios()
          },
          error: async (e) => {
            console.log(e);
            this.store.dispatch(hideLoader());
            await this.swal.displayErrorMessage("No se pudo registrar el usuario", e.error.error.message)
          }
        }
      )
    }
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

  openModalGestionUsuario(content: TemplateRef<any>, usuario?: any) {
    if (usuario) {
      this.setUsuarioForm(usuario)
    }
    this.modalGestionUsuario = this.modalService.open(content, { animation: true, backdrop: 'static', centered: true, size: 'lg' })
  }

  closeModalGestionUsuario() {
    this.modalGestionUsuario.close();
    this.resetUsuarioForm()
  }

  setUsuarioForm(usuario: any) {
    this.usuarioIdSeleccionado = usuario.usuarioId
    this.usuarioForm.patchValue({
      apellido: usuario.apellido,
      nombre: usuario.nombre,
      username: usuario.username,
      email: usuario.email,
      dni: usuario.dni,
      password: usuario.password,
      organizacion: usuario.organizacionId,
      rol: usuario.rolId,
    })
  }

  resetUsuarioForm() {
    this.usuarioIdSeleccionado = null
    this.usuarioForm = new FormGroup({
      apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      rol: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      dni: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
      username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^\S+$/)]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&./ ])[A-Za-z\d@$!%*?&./ ]{8,20}$/)]),
      organizacion: new FormControl('', [Validators.required]),
    });
    this.passwordEyeIcon = 'ico-eye-grey.png';
    this.inputPasswordType = 'password';
  }

  changeEyePasswordIco(): void {
    if (this.passwordEyeIcon == 'ico-eye-grey.png') {
      this.passwordEyeIcon = 'ico-eye-closed-grey.png';
      this.inputPasswordType = 'text';
    } else if (this.passwordEyeIcon == 'ico-eye-closed-grey.png') {
      this.passwordEyeIcon = 'ico-eye-grey.png';
      this.inputPasswordType = 'password';
    }
  }

  get apellido() {
    return this.usuarioForm.get('apellido')!;
  }

  get nombre() {
    return this.usuarioForm.get('nombre')!;
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

  get username() {
    return this.usuarioForm.get('username')!;
  }

  get password() {
    return this.usuarioForm.get('password')!;
  }

  get organizacion() {
    return this.usuarioForm.get('organizacion')!;
  }

}
