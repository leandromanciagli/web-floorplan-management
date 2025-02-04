import { TestBed } from '@angular/core/testing';

import { PlanoEspecialidadService } from './plano-especialidad.service';

describe('PlanoEspecialidadService', () => {
  let service: PlanoEspecialidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanoEspecialidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
