import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageViewComponent } from './manage-view.component';

describe('ManageViewComponent', () => {
  let component: ManageViewComponent;
  let fixture: ComponentFixture<ManageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
