import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPackComponent } from './crear-pack.component';

describe('CrearPackComponent', () => {
  let component: CrearPackComponent;
  let fixture: ComponentFixture<CrearPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
