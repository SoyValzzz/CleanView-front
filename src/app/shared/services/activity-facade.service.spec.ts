import { TestBed } from '@angular/core/testing';

import { ActivityFacadeService } from './activity-facade.service';

describe('ActivityFacadeService', () => {
  let service: ActivityFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
