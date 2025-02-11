import { TestBed } from '@angular/core/testing';

import { ConfiguracionParqueaderoService } from './configuracion-parqueadero.service';

describe('ConfiguracionParqueaderoService', () => {
  let service: ConfiguracionParqueaderoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracionParqueaderoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
