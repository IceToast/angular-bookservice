import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DunningComponent } from './dunning.component';

describe('DunningComponent', () => {
  let component: DunningComponent;
  let fixture: ComponentFixture<DunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DunningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
