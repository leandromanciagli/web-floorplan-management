import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';
import { showLoader, hideLoader } from '@components/loader/loader.actions';
import { Store, select } from '@ngrx/store';
import { NgbModal, NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { OrganizacionService } from '@services/organizacion/organizacion.service';
import { ProvinciaService } from '@services/provincia/provincia.service';
import { loaderSelector } from '@components/loader/loader.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-organizacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbTooltip,
  ],
  providers: [
    OrganizacionService,
    ProvinciaService,
    SweetAlertService,
    NgbModal,
    NgbActiveModal,
  ],
  templateUrl: './organizacion.component.html',
  styleUrl: './organizacion.component.css'
})
export class OrganizacionComponent {

  organizacionForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    direccion: new FormControl('', [Validators.required, Validators.minLength(2)]),
    provincia: new FormControl('', [Validators.required, Validators.minLength(2)]),
    ciudad: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email1: new FormControl('', [Validators.email]),
    email2: new FormControl('', [Validators.email]),
    telefono1: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
    telefono2: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
    // patronExpediente: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });
  organizaciones: any[] = [];
  organizacionIdSeleccionada = null;

  provincias: any[] = []
  ciudades: any[] = []

  loading$: Observable<boolean>;


  constructor(
    private store: Store,
    private swal: SweetAlertService,
    private modalService: NgbModal,
    private modalGestionOrganizacion: NgbActiveModal,
    private organizacionService: OrganizacionService,
    private provinciaService: ProvinciaService,
  ) {
    this.loading$ = this.store.pipe(select(loaderSelector));
   }

  ngOnInit(): void {
    this.loadOrganizaciones()
    this.loadProvincias()
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

  async loadProvincias() {
    this.store.dispatch(showLoader());
    this.provincias = this.provinciaService.getAll();
  }

  manageOrganizacion() {
    let organizacion = {
      nombre: this.organizacionForm.value.nombre,
      provincia: this.organizacionForm.value.provincia,
      ciudad: this.organizacionForm.value.ciudad,
      direccion: this.organizacionForm.value.direccion,
      email1: this.organizacionForm.value.email1,
      email2: this.organizacionForm.value.email2,
      telefono1: this.organizacionForm.value.telefono1,
      telefono2: this.organizacionForm.value.telefono2,
      // patronExpediente: this.organizacionForm.value.patronExpediente,
    }
    this.store.dispatch(showLoader());
    if (this.organizacionIdSeleccionada) {
      this.organizacionService.update(this.organizacionIdSeleccionada, organizacion).subscribe(
        {
          next: async () => {
            this.store.dispatch(hideLoader());
            await this.swal.displaySuccessMessage("Organización editada correctamente")
            this.closeModalGestionOrganizacion()
            this.loadOrganizaciones()
          },
          error: async (e) => {
            console.log(e);
            this.store.dispatch(hideLoader());
            await this.swal.displayErrorMessage()
          }
        }
      )
    } else {
      this.organizacionService.create(organizacion).subscribe(
        {
          next: async () => {
            this.store.dispatch(hideLoader());
            await this.swal.displaySuccessMessage("Organización creada correctamente")
            this.closeModalGestionOrganizacion()
            this.loadOrganizaciones()
          },
          error: async (e) => {
            console.log(e);
            this.store.dispatch(hideLoader());
            await this.swal.displayErrorMessage()
          }
        }
      )
    }
  }

  async deleteOrganizacion(organizacion: any) {
    const userChoise = await this.swal.displayDeleteMessage("organización")
    if (userChoise.isConfirmed) {
      this.store.dispatch(showLoader());
      this.organizacionService.delete(organizacion.organizacionId).subscribe(
        {
          next: async () => {
            this.store.dispatch(hideLoader());
            await this.swal.displaySuccessMessage("Organización eliminada")
            this.loadOrganizaciones()
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

  openModalGestionOrganizacion(content: TemplateRef<any>, organizacion?: any) {
    if (organizacion) {
      this.setorganizacionForm(organizacion)
    }
    this.modalGestionOrganizacion = this.modalService.open(content, { animation: true, backdrop: 'static', centered: true, size: 'lg' })
  }

  closeModalGestionOrganizacion() {
    this.modalGestionOrganizacion.close();
    this.resetOrganizacionForm()
  }

  setorganizacionForm(organizacion: any) {
    this.organizacionIdSeleccionada = organizacion.organizacionId
    this.organizacionForm.patchValue({
      nombre: organizacion.nombre,
      provincia: organizacion.provincia,
      ciudad: organizacion.ciudad,
      direccion: organizacion.direccion,
      email1: organizacion.email1,
      email2: organizacion.email2,
      telefono1: organizacion.telefono1,
      telefono2: organizacion.telefono2,
      // patronExpediente: organizacion.patronExpediente,
    })
  }

  resetOrganizacionForm() {
    this.organizacionIdSeleccionada = null
    this.organizacionForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      direccion: new FormControl('', [Validators.required, Validators.minLength(2)]),
      provincia: new FormControl('', [Validators.required, Validators.minLength(2)]),
      ciudad: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email1: new FormControl('', [Validators.email]),
      email2: new FormControl('', [Validators.email]),
      telefono1: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
      telefono2: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
      // patronExpediente: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });

  }

  get nombre() {
    return this.organizacionForm.get('nombre')!;
  }

  get provincia() {
    return this.organizacionForm.get('provincia')!;
  }

  get ciudad() {
    return this.organizacionForm.get('ciudad')!;
  }

  get direccion() {
    return this.organizacionForm.get('direccion')!;
  }

  get email1() {
    return this.organizacionForm.get('email1')!;
  }

  get email2() {
    return this.organizacionForm.get('email2')!;
  }

  get telefono1() {
    return this.organizacionForm.get('telefono1')!;
  }

  get telefono2() {
    return this.organizacionForm.get('telefono2')!;
  }

  // get patronExpediente() {
  //   return this.organizacionForm.get('patronExpediente')!;
  // }

}
