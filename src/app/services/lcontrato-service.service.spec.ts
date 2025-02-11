import { TestBed } from '@angular/core/testing';

import { LcontratoServiceService } from './lcontrato-service.service';

describe('LcontratoServiceService', () => {
  let service: LcontratoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LcontratoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
