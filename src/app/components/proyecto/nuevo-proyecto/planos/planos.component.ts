import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { PlanoEditorComponent } from '@components/proyecto/nuevo-proyecto/planos/plano-editor/plano-editor.component';
import { showLoader, hideLoader } from '@components/loader/loader.actions';
import { Store } from '@ngrx/store';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';
import { PlanoModalViewComponent } from '@components/proyecto/nuevo-proyecto/planos/plano-modal-view/plano-modal-view.component';
import { PlanoEspecialidadService } from '@services/plano-especialidad/plano-especialidad.service';


@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    PlanoEditorComponent,
    PlanoModalViewComponent,
  ],
  providers: [
    NgbModal,
    PlanoEspecialidadService,
  ],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css'
})
export class PlanosComponent {
  @Input() planos!: FormArray;
  @Output() planosChange = new EventEmitter<FormArray>();
  
  especialidades: any[] = [];


  constructor(
    private store: Store,
    private swal: SweetAlertService,
    private modalService: NgbModal,
    private planoEspecialidadService: PlanoEspecialidadService,
  ) { }

  ngOnInit() {
    this.loadEspecialidades()
  }

  async loadEspecialidades() {
    this.especialidades = this.planoEspecialidadService.getAll()
    // this.store.dispatch(showLoader());
    // this.planoEspecialidadService.getAll().subscribe(
    //   {
    //     next: (data) => {
    //       this.especialidades = data;
    //       this.store.dispatch(hideLoader());
    //     },
    //     error: async (e) => {
    //       console.log(e);
    //       this.store.dispatch(hideLoader());
    //       await this.swal.displayErrorMessage()
    //     }
    //   }
    // );
  } 

  openModalGestionPlano(croppedImage: string) {
    const modalGestionPlano = this.modalService.open(PlanoModalViewComponent, { 
      animation: true, 
      backdrop: 'static', 
      centered: true, 
      size: 'lg' 
    })

    modalGestionPlano.componentInstance.especialidades = this.especialidades;
    modalGestionPlano.componentInstance.croppedImage = croppedImage;

    // Escuchar el evento planoConfirmado del modal
    modalGestionPlano.componentInstance.planoConfirmado.subscribe((nuevoPlano: FormGroup) => {
      this.planos.push(nuevoPlano);
      this.planosChange.emit(this.planos); // Notifica los cambios al formulario principal            
      modalGestionPlano.close();
    });

    modalGestionPlano.componentInstance.planoDescartado.subscribe(() => {
      modalGestionPlano.dismiss();
    });
  }

  async eliminarPlano(index: number) {
    const userChoise = await this.swal.displayQuestion("Eliminar plano")
    if (userChoise.isConfirmed) {
      this.planos.removeAt(index);
      this.planosChange.emit(this.planos);
    }
  }

  getDescripcionEspecialidad(especialidadId: string) {     
    return this.especialidades.find(especialidad => especialidad.especialidadId === especialidadId).descripcion;
  }

}
