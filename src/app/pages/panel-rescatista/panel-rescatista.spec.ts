import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelRescatista } from './panel-rescatista';

describe('PanelRescatista', () => {
  let component: PanelRescatista;
  let fixture: ComponentFixture<PanelRescatista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelRescatista],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelRescatista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
