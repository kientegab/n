import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceDisponibiliteComponent } from './piece-disponibilite.component';

describe('PieceDisponibiliteComponent', () => {
  let component: PieceDisponibiliteComponent;
  let fixture: ComponentFixture<PieceDisponibiliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieceDisponibiliteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieceDisponibiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
