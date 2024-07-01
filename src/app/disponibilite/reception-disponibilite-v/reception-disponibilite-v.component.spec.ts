import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionDisponibiliteVComponent } from './reception-disponibilite-v.component';

describe('ReceptionDisponibiliteVComponent', () => {
  let component: ReceptionDisponibiliteVComponent;
  let fixture: ComponentFixture<ReceptionDisponibiliteVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionDisponibiliteVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionDisponibiliteVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
