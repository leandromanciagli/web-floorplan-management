import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { PlanoEditorComponent } from '@components/utils/plano-editor/plano-editor/plano-editor.component';
import { PlanoEspecialidadService } from '@services/plano-especialidad/plano-especialidad.service';
import { showLoader, hideLoader } from '@components/loader/loader.actions';
import { Store } from '@ngrx/store';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';


@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    PlanoEditorComponent,
  ],
  providers: [
    PlanoEspecialidadService,
  ],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css'
})
export class PlanosComponent {
  @Input() planos!: FormArray;
  @Output() planosChange = new EventEmitter<FormArray>();
  
  planoForm!: FormGroup;
  especialidades: any[] = [];
  // especialidadId = '';
  // etiquetas: string[] = [];


  constructor(
    private store: Store,
    private swal: SweetAlertService,
    private formBuilder: FormBuilder,
    private planoEspecialidadService: PlanoEspecialidadService,
    
  ) { }

  ngOnInit() {
    this.loadEspecialidades()
    this.planoForm = this.formBuilder.group({
      imagen: ['', [Validators.required]],
      especialidadId: [''],
      // etiquetas: [[]],
    });
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

  agregarPlano(plano: string) {
    this.planoForm.patchValue({
      imagen: plano,
      // especialidadId: this.especialidadId,
      // etiquetas: this.etiquetas,
    });

    this.planos.push(this.planoForm);
    this.planosChange.emit(this.planos);
    this.resetPlanoForm()
  }

  resetPlanoForm() {
    this.planoForm = this.formBuilder.group({
      imagen: ['', [Validators.required]],
      especialidadId: [''],
      // etiquetas: [[]],
    });
  }

  eliminarPlano(index: number) {
    this.planos.removeAt(index);
    this.planosChange.emit(this.planos);
  }

  // agregarEtiqueta(etiqueta: string) {
  //   if (etiqueta.trim()) {
  //     this.etiquetas.push(etiqueta.trim());
  //   }
  // }

  // eliminarEtiqueta(etiqueta: string) {
  //   this.etiquetas = this.etiquetas.filter(e => e !== etiqueta);
  // }

  get plano() {
    return {
      imagen: this.planoForm.get('imagen')!,
      especialidad: this.planoForm.get('especialidadId')!,
      // etiquetas: this.planoForm.get('etiquetas')!,
    };
  }
}
