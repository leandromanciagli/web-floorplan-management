import { TestBed } from '@angular/core/testing';

import { OrganizacionService } from '../../components/organizacion/organizacion.service';

describe('OrganizacionService', () => {
  let service: OrganizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
