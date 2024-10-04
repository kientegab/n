import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDisponibiliteAgentComponent } from './details-disponibilite-agent.component';

describe('DetailsDisponibiliteAgentComponent', () => {
  let component: DetailsDisponibiliteAgentComponent;
  let fixture: ComponentFixture<DetailsDisponibiliteAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsDisponibiliteAgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsDisponibiliteAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
