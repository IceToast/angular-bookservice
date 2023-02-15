import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationTypeTableComponent } from './publication-type-table.component';

describe('PublicationTypeTableComponent', () => {
  let component: PublicationTypeTableComponent;
  let fixture: ComponentFixture<PublicationTypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationTypeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
