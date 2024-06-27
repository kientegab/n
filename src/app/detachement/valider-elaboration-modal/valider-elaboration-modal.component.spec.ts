import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValiderElaborationModalComponent } from './valider-elaboration-modal.component';

describe('ValiderElaborationModalComponent', () => {
  let component: ValiderElaborationModalComponent;
  let fixture: ComponentFixture<ValiderElaborationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValiderElaborationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValiderElaborationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
