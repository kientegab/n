import { TestBed } from '@angular/core/testing';

import { VisaProjetService } from './visa-projet.service';

describe('VisaProjetService', () => {
  let service: VisaProjetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisaProjetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
