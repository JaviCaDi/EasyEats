import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasRecibidasComponent } from './reservas-recibidas.component';

describe('ReservasRecibidasComponent', () => {
  let component: ReservasRecibidasComponent;
  let fixture: ComponentFixture<ReservasRecibidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasRecibidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasRecibidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
