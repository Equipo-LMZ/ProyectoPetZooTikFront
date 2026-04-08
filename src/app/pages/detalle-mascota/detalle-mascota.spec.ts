import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMascota } from './detalle-mascota';

describe('DetalleMascota', () => {
  let component: DetalleMascota;
  let fixture: ComponentFixture<DetalleMascota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMascota],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleMascota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
