import { TestBed } from '@angular/core/testing';

import { IngresoPlacasService } from './ingreso-placas.service';

describe('IngresoPlacasService', () => {
  let service: IngresoPlacasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngresoPlacasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
