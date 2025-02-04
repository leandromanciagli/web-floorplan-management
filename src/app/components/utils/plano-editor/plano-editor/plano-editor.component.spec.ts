import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoEditorComponent } from './plano-editor.component';

describe('PlanoEditorComponent', () => {
  let component: PlanoEditorComponent;
  let fixture: ComponentFixture<PlanoEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanoEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
