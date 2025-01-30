import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';
import { showLoader, hideLoader } from '@components/loader/loader.actions';
import { Store } from '@ngrx/store';
import { DestinoService } from '@services/destino/destino.service';
import { TipoObraService } from '@services/tipo-obra/tipo-obra.service';
import { TipoPersonaService } from '@services/tipo-persona/tipo-persona.service';
import { ProvinciaService } from '@services/provincia/provincia.service';
import { ProyectoService } from '@services/proyecto/proyecto.service';


@Component({
  selector: 'app-proyecto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbNavModule,
  ],
  providers: [
    SweetAlertService,
    DestinoService,
    TipoObraService,
    TipoPersonaService,
    ProvinciaService,
    ProyectoService,
  ],
  templateUrl: './nuevo-proyecto.component.html',
  styleUrl: './nuevo-proyecto.component.css'
})
export class ProyectoComponent {

  destinos: any[] = [];
  tiposObra: any[] = [];
  tiposPersona: any[] = [];
  provincias: any[] = [];

  proyectoDeConstruccionForm!: FormGroup;
  proyectistaForm!: FormGroup;

  currentStep = 1;

  constructor(
    private store: Store,
    private swal: SweetAlertService,
    private destinoService: DestinoService,
    private tipoObraService: TipoObraService,
    private tipoPersonaService: TipoPersonaService,
    private provinciaService: ProvinciaService,
    private proyectoService: ProyectoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadDestinos()
    this.loadTiposObra()
    this.loadProvincias()
    this.loadTiposPersona()
    this.proyectoDeConstruccionForm = this.formBuilder.group({
      proyecto: this.formBuilder.group({
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        nroExpediente: ['', [Validators.required]],
        provincia: ['', [Validators.required]],
        ciudad: ['', [Validators.required]],
        ubicacion: ['', [Validators.required]],
        tipoObra: ['', [Validators.required]],
        destino: ['', [Validators.required]],
        escala: ['', [Validators.required]],
        antecedentes: [''],
        referencias: [''],
        otrasExigencias: [''],
      }),
      propietario: this.formBuilder.group({
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        nombres: ['', [Validators.required, Validators.minLength(2)]],
        dni: ['', [Validators.pattern(/^[0-9]+$/)]],
        domicilio: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.email]],
        telefono: ['', [Validators.pattern(/^[0-9]+$/)]],
      }),
      proyectistas: this.formBuilder.array([]),
      direccionTecnica: this.formBuilder.group({
        tipoPersonaId: ['', [Validators.required]],
        razonSocial: [''],
        cuit: [''],
        nombreApellido: ['', [Validators.required, Validators.minLength(2)]],
        dni: ['', [Validators.pattern(/^[0-9]+$/)]],
        matricula: ['', Validators.required],
        especialidad: ['', [Validators.minLength(2)]],
        domicilio: ['', [Validators.required, Validators.minLength(2)]],
        telefono: ['', [Validators.pattern(/^[0-9]+$/)]],
        email: ['', [Validators.email]],
      }),
      // planos: this.formBuilder.array([]),
    });

    this.proyectistaForm = this.formBuilder.group({
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.pattern(/^[0-9]+$/)]],
      matricula: ['', Validators.required],
      domicilio: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.pattern(/^[0-9]+$/)]],
    });

    // Escucha cambios en tipoPersona
    this.proyectoDeConstruccionForm.get('direccionTecnica.tipoPersonaId')?.valueChanges.subscribe((tipoPersona) => {
      const razonSocialControl = this.proyectoDeConstruccionForm.get('direccionTecnica.razonSocial');
      const cuitControl = this.proyectoDeConstruccionForm.get('direccionTecnica.cuit');
      if (tipoPersona === 'PERSONAJURIDICA') {
        razonSocialControl?.setValidators([Validators.required, Validators.minLength(2)]);
        cuitControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]+$/)]);
      } else {
        razonSocialControl?.clearValidators();
        cuitControl?.clearValidators();
      }
      razonSocialControl?.updateValueAndValidity(); // Refresca las validaciones
      cuitControl?.updateValueAndValidity();
    });
  }

  async loadDestinos() {
    this.store.dispatch(showLoader());
    this.destinoService.getAll().subscribe(
      {
        next: (data) => {
          this.destinos = data;
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

  async loadTiposObra() {
    this.store.dispatch(showLoader());
    this.tipoObraService.getAll().subscribe(
      {
        next: (data) => {
          this.tiposObra = data;
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

  async loadTiposPersona() {
    this.store.dispatch(showLoader());
    this.tipoPersonaService.getAll().subscribe(
      {
        next: (data) => {
          this.tiposPersona = data;
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

  async loadProvincias() {
    this.store.dispatch(showLoader());
    this.provinciaService.getAll().subscribe(
      {
        next: (data) => {
          this.provincias = data;
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

  async manageProyecto() {
    const userChoise = await this.swal.displayQuestion("¿Estás seguro/a?", "Estás a punto de registrar un nuevo proyecto de construcción")
    if (userChoise.isConfirmed) {
      this.store.dispatch(showLoader());
      // if (this.organizacionIdSeleccionada) {
      //   this.organizacionService.update(this.organizacionIdSeleccionada, organizacion).subscribe(
      //     {
      //       next: async () => {
      //         this.store.dispatch(hideLoader());
      //         await this.swal.displaySuccessMessage("Organización editada correctamente")
      //         this.closeModalGestionOrganizacion()
      //         this.loadOrganizaciones()
      //       },
      //       error: async (e) => {
      //         console.log(e);
      //         this.store.dispatch(hideLoader());
      //         await this.swal.displayErrorMessage()
      //       }
      //     }
      //   )
      // } else {
        const payload = this.proyectoDeConstruccionForm.value
        this.proyectoService.create(payload).subscribe(
          {
            next: async () => {
              this.store.dispatch(hideLoader());
              await this.swal.displaySuccessMessage("Proyecto creado correctamente")
            },
            error: async (e) => {
              console.log(e);
              this.store.dispatch(hideLoader());
              await this.swal.displayErrorMessage()
            }
          }
        )
      // }
    }
  }

  // Método para crear un nuevo proyectista en el FormArray
  agregarProyectista(): void {
    this.proyectistas.push(this.proyectistaForm);
    this.resetProyectistaForm()
  }

  resetProyectistaForm() {
    this.proyectistaForm = this.formBuilder.group({
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.pattern(/^[0-9]+$/)]],
      matricula: ['', Validators.required],
      domicilio: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.pattern(/^[0-9]+$/)]],
    });
  }

  // Método para eliminar un proyectista del FormArray
  eliminarProyectista(index: number): void {
    this.proyectistas.removeAt(index);
  }

  get proyecto() {
    return {
      nombre: this.proyectoDeConstruccionForm.get('proyecto.nombre')!,
      nroExpediente: this.proyectoDeConstruccionForm.get('proyecto.nroExpediente')!,
      provincia: this.proyectoDeConstruccionForm.get('proyecto.provincia')!,
      ciudad: this.proyectoDeConstruccionForm.get('proyecto.ciudad')!,
      ubicacion: this.proyectoDeConstruccionForm.get('proyecto.ubicacion')!,
      tipoObra: this.proyectoDeConstruccionForm.get('proyecto.tipoObra')!,
      destino: this.proyectoDeConstruccionForm.get('proyecto.destino')!,
      escala: this.proyectoDeConstruccionForm.get('proyecto.escala')!,
      antecedentes: this.proyectoDeConstruccionForm.get('proyecto.antecedentes')!,
      referencias: this.proyectoDeConstruccionForm.get('proyecto.referencias')!,
      otrasExigencias: this.proyectoDeConstruccionForm.get('proyecto.otrasExigencias')!,
    };
  }

  get proyectistas(): FormArray {
    return this.proyectoDeConstruccionForm.get('proyectistas') as FormArray;
  }

  get propietario() {
    return {
      apellido: this.proyectoDeConstruccionForm.get('propietario.apellido')!,
      nombres: this.proyectoDeConstruccionForm.get('propietario.nombres')!,
      dni: this.proyectoDeConstruccionForm.get('propietario.dni')!,
      domicilio: this.proyectoDeConstruccionForm.get('propietario.domicilio')!,
      telefono: this.proyectoDeConstruccionForm.get('propietario.telefono')!,
      email: this.proyectoDeConstruccionForm.get('propietario.email')!,
    };
  }

  get proyectista() {
    return {
      apellido: this.proyectistaForm.get('apellido')!,
      nombre: this.proyectistaForm.get('nombre')!,
      dni: this.proyectistaForm.get('dni')!,
      matricula: this.proyectistaForm.get('matricula')!,
      domicilio: this.proyectistaForm.get('domicilio')!,
      telefono: this.proyectistaForm.get('telefono')!,
    };
  }

  get direccionTecnica() {
    return {
      tipoPersonaId: this.proyectoDeConstruccionForm.get('direccionTecnica.tipoPersonaId')!,
      razonSocial: this.proyectoDeConstruccionForm.get('direccionTecnica.razonSocial')!,
      cuit: this.proyectoDeConstruccionForm.get('direccionTecnica.cuit')!,
      nombreApellido: this.proyectoDeConstruccionForm.get('direccionTecnica.nombreApellido')!,
      dni: this.proyectoDeConstruccionForm.get('direccionTecnica.dni')!,
      matricula: this.proyectoDeConstruccionForm.get('direccionTecnica.matricula')!,
      especialidad: this.proyectoDeConstruccionForm.get('direccionTecnica.especialidad')!,
      domicilio: this.proyectoDeConstruccionForm.get('direccionTecnica.domicilio')!,
      telefono: this.proyectoDeConstruccionForm.get('direccionTecnica.telefono')!,
      email: this.proyectoDeConstruccionForm.get('direccionTecnica.email')!,
    };
  }

}

