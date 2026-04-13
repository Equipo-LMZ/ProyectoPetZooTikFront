import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaAlerts } from './prueba-alerts';

describe('PruebaAlerts', () => {
  let component: PruebaAlerts;
  let fixture: ComponentFixture<PruebaAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(PruebaAlerts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
