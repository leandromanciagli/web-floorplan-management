import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-plano-modal-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    SweetAlertService,
  ],
  templateUrl: './plano-modal-view.component.html',
  styleUrl: './plano-modal-view.component.css'
})
export class PlanoModalViewComponent {
  @Input() croppedImage!: string;
  @Input() especialidades: any[] = [];
  @Output() planoConfirmado = new EventEmitter<FormGroup>();
  @Output() planoDescartado = new EventEmitter<void>();

  
  planoForm!: FormGroup;
  tagText: string = '';

  constructor(
    private swal: SweetAlertService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.planoForm = this.formBuilder.group({
      imagen: ['', [Validators.required]],
      especialidad: ['', [Validators.required]],
      etiquetas: [[]],
    });
    this.planoForm.patchValue({
      imagen: this.croppedImage,
    });        
  }

  resetPlanoForm() {
    this.planoForm = this.formBuilder.group({
      imagen: ['', [Validators.required]],
      especialidad: ['', [Validators.required]],
      etiquetas: [[]],
    });
  }

  addTag() {
    const etiquetasControl = this.planoForm.get('etiquetas');
    if (this.tagText.trim() && etiquetasControl) {
      const etiquetas = etiquetasControl.value || [];
      if (!etiquetas.includes(this.tagText.trim())) {
        etiquetas.push(this.tagText.trim());
        etiquetasControl.setValue(etiquetas);
      }
    }
    this.tagText = '';
  }

  deleteTag(index: number) {
    const etiquetasControl = this.planoForm.get('etiquetas');
    if (etiquetasControl) {
      const etiquetas = etiquetasControl.value || [];
      etiquetas.splice(index, 1);
      etiquetasControl.setValue(etiquetas);
    }
  }

  discardPlano() {
    this.planoDescartado.emit();
    this.resetPlanoForm()
  }

  confirmPlano() {
    this.planoConfirmado.emit(this.planoForm);
    this.resetPlanoForm()
  }

  get plano() {
    return {
      imagen: this.planoForm.get('imagen')!,
      especialidad: this.planoForm.get('especialidad')!,
      etiquetas: this.planoForm.get('etiquetas')!,
    };
  }

}
