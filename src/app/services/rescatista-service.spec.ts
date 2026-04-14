import { TestBed } from '@angular/core/testing';

import { RescatistaService } from './rescatista-service';

describe('RescatistaService', () => {
  let service: RescatistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RescatistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
