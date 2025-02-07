import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoModalViewComponent } from './plano-modal-view.component';

describe('PlanoModalViewComponent', () => {
  let component: PlanoModalViewComponent;
  let fixture: ComponentFixture<PlanoModalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanoModalViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanoModalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
