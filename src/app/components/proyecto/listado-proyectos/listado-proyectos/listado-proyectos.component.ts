import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';
import { showLoader, hideLoader } from '@components/loader/loader.actions';
import { Store, select } from '@ngrx/store';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { loaderSelector } from '@components/loader/loader.selectors';
import { Observable } from 'rxjs';
import { ProyectoService } from '@services/proyecto/proyecto.service';

@Component({
  selector: 'app-listado-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltip,
  ],
  providers: [
    ProyectoService,
    SweetAlertService,
  ],
  templateUrl: './listado-proyectos.component.html',
  styleUrl: './listado-proyectos.component.css'
})
export class ListadoProyectosComponent {

  proyectos: any[] = [];
  proyectoIdSeleccionado = null;

  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    private swal: SweetAlertService,
    private proyectoService: ProyectoService,
  ) {
    this.loading$ = this.store.pipe(select(loaderSelector));
   }

  ngOnInit(): void {
    this.loadProyectos()
  }

  async loadProyectos() {
    this.store.dispatch(showLoader());
    this.proyectoService.getAll().subscribe(
      {
        next: (data) => {
          this.proyectos = data;
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

  async deleteProyecto(proyecto: any) {
    const userChoise = await this.swal.displayDeleteMessage("proyecto")
    if (userChoise.isConfirmed) {
      this.store.dispatch(showLoader());
      this.proyectoService.delete(proyecto.proyectoId).subscribe(
        {
          next: async () => {
            this.store.dispatch(hideLoader());
            await this.swal.displaySuccessMessage("Proyecto eliminado")
            this.loadProyectos()
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
