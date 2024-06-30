import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerModifierTdemandeDisComponent } from './creer-modifier-tdemande-dis.component';

describe('CreerModifierTdemandeDisComponent', () => {
  let component: CreerModifierTdemandeDisComponent;
  let fixture: ComponentFixture<CreerModifierTdemandeDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreerModifierTdemandeDisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerModifierTdemandeDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
