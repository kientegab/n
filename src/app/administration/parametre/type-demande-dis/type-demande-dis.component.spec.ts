import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeDemandeDisComponent } from './type-demande-dis.component';

describe('TypeDemandeDisComponent', () => {
  let component: TypeDemandeDisComponent;
  let fixture: ComponentFixture<TypeDemandeDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeDemandeDisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeDemandeDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
