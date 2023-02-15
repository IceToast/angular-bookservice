import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsTableComponent } from './keywords-table.component';

describe('KeywordsTableComponent', () => {
  let component: KeywordsTableComponent;
  let fixture: ComponentFixture<KeywordsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeywordsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
