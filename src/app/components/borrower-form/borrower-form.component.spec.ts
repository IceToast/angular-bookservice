import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerFormComponent } from './borrower-form.component';

describe('BorrowerFormComponent', () => {
  let component: BorrowerFormComponent;
  let fixture: ComponentFixture<BorrowerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorrowerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
