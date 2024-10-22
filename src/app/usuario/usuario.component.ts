import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from './usuario.service';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    UsuarioService,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  usuarioForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    dni: new FormControl('', [Validators.required, Validators.minLength(7)]),
    email: new FormControl('', [Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^\S+$/)]),
    password: new FormControl('', [Validators.required]),
  });

  usuarios: any[] = [];
  usuarioIdSeleccionado = null;


  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUsuarios()
  }

  async loadUsuarios() {
    this.usuarioService.getAll().subscribe(
      {
        next: (data: any) => {
          this.usuarios = data;
        },
        error: async (e: any) => {
          console.log(e);
          alert("Error al cargar los usuarios")
        }
      }
    );
  }

  manageUsuario() {
    let usuario = {
      nombre: this.usuarioForm.value.nombre,
      apellido: this.usuarioForm.value.apellido,
      dni: this.usuarioForm.value.dni,
      username: this.usuarioForm.value.username,
      email: this.usuarioForm.value.email,
      password: this.usuarioForm.value.password,
    }
    
    if (this.usuarioIdSeleccionado) {
      this.usuarioService.update(this.usuarioIdSeleccionado, usuario).subscribe(
        {
          next: async () => {
            alert("¡Usuario editado correctamente!")
            this.resetUsuarioForm()
            this.loadUsuarios()
          },
          error: async (e: any) => {
            console.log(e);
            alert("Error al editar el usuario")
          }
        }
      )
    } else {
      this.usuarioService.create(usuario).subscribe(
        {
          next: async () => {
            alert("¡Usuario creado correctamente!")
            this.resetUsuarioForm()
            this.loadUsuarios()
          },
          error: async (e: any) => {
            console.log(e);
            alert("Error al cargar el usuario")
          }
        }
      )
    }
  }

  async deleteUsuario(usuario: any) {
    const userChoise = await confirm("¿Eliminar usuario?")
    if (userChoise) {
      this.usuarioService.delete(usuario.usuarioId).subscribe(
        {
          next: async () => {
            await alert("¡Usuario eliminado!")
            this.loadUsuarios()
          },
          error: async (e: any) => {
            console.log(e);
            await alert("Error al eliminar el usuario")
          }
        }
      );
    }
  }

  setUsuarioForm(usuario: any) {
    this.usuarioIdSeleccionado = usuario.usuarioId
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      dni: usuario.dni,
      username: usuario.username,
      email: usuario.email,
      password: usuario.password,
    })
  }

  resetUsuarioForm() {
    this.usuarioIdSeleccionado = null
    this.usuarioForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
      dni: new FormControl('', [Validators.required, Validators.minLength(7)]),
      email: new FormControl('', [Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^\S+$/)]),
      password: new FormControl('', [Validators.required]),
    });
  }


  get nombre() {
    return this.usuarioForm.get('nombre')!;
  }

  get apellido() {
    return this.usuarioForm.get('apellido')!;
  }

  get dni() {
    return this.usuarioForm.get('dni')!;
  }

  get email() {
    return this.usuarioForm.get('email')!;
  }

  get username() {
    return this.usuarioForm.get('username')!;
  }

  get password() {
    return this.usuarioForm.get('password')!;
  }

}
