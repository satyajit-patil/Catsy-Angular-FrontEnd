import { TestBed } from '@angular/core/testing';

import { QueryStringParametersService } from './query-string-parameters.service';

describe('QueryStringParametersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryStringParametersService = TestBed.get(QueryStringParametersService);
    expect(service).toBeTruthy();
  });
});
