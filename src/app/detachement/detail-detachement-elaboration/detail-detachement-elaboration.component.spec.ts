import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDetachementElaborationComponent } from './detail-detachement-elaboration.component';

describe('DetailDetachementElaborationComponent', () => {
  let component: DetailDetachementElaborationComponent;
  let fixture: ComponentFixture<DetailDetachementElaborationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDetachementElaborationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDetachementElaborationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
