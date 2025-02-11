import { TestBed } from '@angular/core/testing';

import { CantEspaciosService } from './cant-espacios.service';

describe('CantEspaciosService', () => {
  let service: CantEspaciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CantEspaciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
