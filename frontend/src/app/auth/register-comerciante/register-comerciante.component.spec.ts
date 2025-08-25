import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComercianteComponent } from './register-comerciante.component';

describe('RegisterComercianteComponent', () => {
  let component: RegisterComercianteComponent;
  let fixture: ComponentFixture<RegisterComercianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComercianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComercianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
