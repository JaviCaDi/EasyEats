import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasNegocioComponent } from './estadisticas-negocio.component';

describe('EstadisticasNegocioComponent', () => {
  let component: EstadisticasNegocioComponent;
  let fixture: ComponentFixture<EstadisticasNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasNegocioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
