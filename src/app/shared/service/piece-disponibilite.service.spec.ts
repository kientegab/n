import { TestBed } from '@angular/core/testing';

import { PieceDisponibiliteService } from './piece-disponibilite.service';

describe('PieceDisponibiliteService', () => {
  let service: PieceDisponibiliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieceDisponibiliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
