import { TestBed } from '@angular/core/testing';

import { TipoObraService } from './tipo-obra.service';

describe('TipoObraService', () => {
  let service: TipoObraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoObraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
