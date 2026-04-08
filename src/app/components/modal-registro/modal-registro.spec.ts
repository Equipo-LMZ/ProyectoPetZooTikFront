import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistro } from './modal-registro';

describe('ModalRegistro', () => {
  let component: ModalRegistro;
  let fixture: ComponentFixture<ModalRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRegistro],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRegistro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
