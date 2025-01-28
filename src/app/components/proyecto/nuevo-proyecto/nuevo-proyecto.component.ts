import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';
import { showLoader, hideLoader } from '@components/loader/loader.actions';
import { Store } from '@ngrx/store';
import { DestinoService } from '@services/destino/destino.service';
import { TipoObraService } from '@services/tipo-obra/tipo-obra.service';
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
    ProvinciaService,
    ProyectoService,
  ],
  templateUrl: './nuevo-proyecto.component.html',
  styleUrl: './nuevo-proyecto.component.css'
})
export class ProyectoComponent {

  destinos: any[] = [];
  tiposObra: any[] = [];
  provincias: any[] = [];

  proyectoDeConstruccionForm!: FormGroup;

  currentStep = 1;

  constructor(
    private store: Store,
    private swal: SweetAlertService,
    private destinoService: DestinoService,
    private tipoObraService: TipoObraService,
    private provinciaService: ProvinciaService,
    private proyectoService: ProyectoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadDestinos()
    this.loadTiposObra()
    this.loadProvincias()
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
        aprobado: false,
      }),
      propietario: this.formBuilder.group({
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        nombres: ['', [Validators.required, Validators.minLength(2)]],
        dni: ['', [Validators.pattern(/^[0-9]+$/)]],
        domicilio: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.email]],
        telefono: ['', [Validators.pattern(/^[0-9]+$/)]],
      }),
      // proyectistas: this.formBuilder.array([]),
      // planos: this.formBuilder.array([]),
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
      // let proyecto = {
      //   nombre: this.proyectoDeConstruccionForm.value.nombre,
      //   nroExpediente: this.proyectoDeConstruccionForm.value.nroExpediente,
      //   provinciaId: this.proyectoDeConstruccionForm.value.provincia,
      //   ciudad: this.proyectoDeConstruccionForm.value.ciudad,
      //   ubicacion: this.proyectoDeConstruccionForm.value.ubicacion,
      //   tipoObraId: this.proyectoDeConstruccionForm.value.tipoObra,
      //   destinoFuncionalId: this.proyectoDeConstruccionForm.value.destino,
      //   escala: this.proyectoDeConstruccionForm.value.escala,
      //   antecedentes: this.proyectoDeConstruccionForm.value.antecedentes,
      //   referencias: this.proyectoDeConstruccionForm.value.referencias,
      //   otrasExigencias: this.proyectoDeConstruccionForm.value.otrasExigencias,
      //   aprobado: false,
      // }
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


  get nombre() {
    return this.proyectoDeConstruccionForm.get('proyecto.nombre')!;
  }

  get nroExpediente() {
    return this.proyectoDeConstruccionForm.get('proyecto.nroExpediente')!;
  }

  get provincia() {
    return this.proyectoDeConstruccionForm.get('proyecto.provincia')!;
  }

  get ciudad() {
    return this.proyectoDeConstruccionForm.get('proyecto.ciudad')!;
  }

  get ubicacion() {
    return this.proyectoDeConstruccionForm.get('proyecto.ubicacion')!;
  }

  get tipoObra() {
    return this.proyectoDeConstruccionForm.get('proyecto.tipoObra')!;
  }

  get destino() {
    return this.proyectoDeConstruccionForm.get('proyecto.destino')!;
  }

  get escala() {
    return this.proyectoDeConstruccionForm.get('proyecto.escala')!;
  }

  get antecedentes() {
    return this.proyectoDeConstruccionForm.get('proyecto.antecedentes')!;
  }

  get referencias() {
    return this.proyectoDeConstruccionForm.get('proyecto.referencias')!;
  }

  get otrasExigencias() {
    return this.proyectoDeConstruccionForm.get('proyecto.otrasExigencias')!;
  }

  get apellido() {
    return this.proyectoDeConstruccionForm.get('propietario.apellido')!;
  }

  get nombres() {
    return this.proyectoDeConstruccionForm.get('propietario.nombres')!;
  }

  get dni() {
    return this.proyectoDeConstruccionForm.get('propietario.dni')!;
  }

  get domicilio() {
    return this.proyectoDeConstruccionForm.get('propietario.domicilio')!;
  }

  get telefono() {
    return this.proyectoDeConstruccionForm.get('propietario.telefono')!;
  }

  get email() {
    return this.proyectoDeConstruccionForm.get('propietario.email')!;
  }
}

