import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirRegistroComponent } from './elegir-registro.component';

describe('ElegirRegistroComponent', () => {
  let component: ElegirRegistroComponent;
  let fixture: ComponentFixture<ElegirRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElegirRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElegirRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
