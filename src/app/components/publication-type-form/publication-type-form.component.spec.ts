import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationTypeFormComponent } from './publication-type-form.component';

describe('PublicationTypeFormComponent', () => {
  let component: PublicationTypeFormComponent;
  let fixture: ComponentFixture<PublicationTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
