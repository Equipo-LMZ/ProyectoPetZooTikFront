import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCandidatura } from './modal-candidatura';

describe('ModalCandidatura', () => {
  let component: ModalCandidatura;
  let fixture: ComponentFixture<ModalCandidatura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCandidatura],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCandidatura);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
