import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTdemandeDisComponent } from './detail-tdemande-dis.component';

describe('DetailTdemandeDisComponent', () => {
  let component: DetailTdemandeDisComponent;
  let fixture: ComponentFixture<DetailTdemandeDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTdemandeDisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTdemandeDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
