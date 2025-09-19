import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarNegociosComponent } from './listar-negocios.component';

describe('ListarNegociosComponent', () => {
  let component: ListarNegociosComponent;
  let fixture: ComponentFixture<ListarNegociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarNegociosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarNegociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
