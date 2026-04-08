import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAnimales } from './gestion-animales';

describe('GestionAnimales', () => {
  let component: GestionAnimales;
  let fixture: ComponentFixture<GestionAnimales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAnimales],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionAnimales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
