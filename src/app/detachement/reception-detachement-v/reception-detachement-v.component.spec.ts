import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionDetachementVComponent } from './reception-detachement-v.component';

describe('ReceptionDetachementVComponent', () => {
  let component: ReceptionDetachementVComponent;
  let fixture: ComponentFixture<ReceptionDetachementVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionDetachementVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionDetachementVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
