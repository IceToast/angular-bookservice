import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerTableComponent } from './borrower-table.component';

describe('BorrowerTableComponent', () => {
  let component: BorrowerTableComponent;
  let fixture: ComponentFixture<BorrowerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorrowerTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
