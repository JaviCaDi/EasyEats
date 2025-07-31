import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPackComponent } from './editar-pack.component';

describe('EditarPackComponent', () => {
  let component: EditarPackComponent;
  let fixture: ComponentFixture<EditarPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
