import { TestBed } from '@angular/core/testing';

import { MotifDisponibiliteService } from './motif-disponibilite.service';

describe('MotifDisponibiliteService', () => {
  let service: MotifDisponibiliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotifDisponibiliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
