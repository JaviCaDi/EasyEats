import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPacksComponent } from './lista-packs.component';

describe('ListaPacksComponent', () => {
  let component: ListaPacksComponent;
  let fixture: ComponentFixture<ListaPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
