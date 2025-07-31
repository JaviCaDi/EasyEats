import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPacksComponent } from './mis-packs.component';

describe('MisPacksComponent', () => {
  let component: MisPacksComponent;
  let fixture: ComponentFixture<MisPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
