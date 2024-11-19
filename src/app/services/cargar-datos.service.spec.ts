import { TestBed } from '@angular/core/testing';

import { CargarDatosService } from './cargar-datos.service';

describe('CargarDatosService', () => {
  let service: CargarDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargarDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
