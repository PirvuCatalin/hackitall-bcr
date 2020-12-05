import { TestBed } from '@angular/core/testing';

import { BcrBackendService } from './bcr-backend.service';

describe('BcrBackendService', () => {
  let service: BcrBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcrBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
