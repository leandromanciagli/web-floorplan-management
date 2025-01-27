import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loaderSelector } from './loader.selectors';


@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.loading$ = this.store.pipe(select(loaderSelector));    
  }

}
