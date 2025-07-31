import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarQrComponent } from './validar-qr.component';

describe('ValidarQrComponent', () => {
  let component: ValidarQrComponent;
  let fixture: ComponentFixture<ValidarQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidarQrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
