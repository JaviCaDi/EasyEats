import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePackComponent } from './detalle-pack.component';

describe('DetallePackComponent', () => {
  let component: DetallePackComponent;
  let fixture: ComponentFixture<DetallePackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
