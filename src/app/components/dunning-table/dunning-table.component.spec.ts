import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DunningTableComponent } from './dunning-table.component';

describe('DunningTableComponent', () => {
  let component: DunningTableComponent;
  let fixture: ComponentFixture<DunningTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DunningTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DunningTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
