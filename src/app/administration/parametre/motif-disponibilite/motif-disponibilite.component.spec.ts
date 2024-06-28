import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotifDisponibiliteComponent } from './motif-disponibilite.component';

describe('MotifDisponibiliteComponent', () => {
  let component: MotifDisponibiliteComponent;
  let fixture: ComponentFixture<MotifDisponibiliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotifDisponibiliteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotifDisponibiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
