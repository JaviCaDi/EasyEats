import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioPacksComponent } from './horario-packs.component';

describe('HorarioPacksComponent', () => {
  let component: HorarioPacksComponent;
  let fixture: ComponentFixture<HorarioPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioPacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
