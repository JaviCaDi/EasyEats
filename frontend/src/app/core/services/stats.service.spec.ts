import { TestBed } from '@angular/core/testing';

import { EstadisticasNegocioService } from './stats.service';

describe('StatsService', () => {
  let service: EstadisticasNegocioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadisticasNegocioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
