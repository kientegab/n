import { TestBed } from '@angular/core/testing';

import { AmpliationProjetService } from './ampliation-projet.service';

describe('AmpliationProjetService', () => {
  let service: AmpliationProjetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmpliationProjetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
