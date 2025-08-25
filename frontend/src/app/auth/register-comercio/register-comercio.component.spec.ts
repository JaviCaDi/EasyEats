import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComercioComponent } from './register-comercio.component';

describe('RegisterComercioComponent', () => {
  let component: RegisterComercioComponent;
  let fixture: ComponentFixture<RegisterComercioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComercioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
