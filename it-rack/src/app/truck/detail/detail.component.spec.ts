import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STruckDetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: STruckDetailComponent;
  let fixture: ComponentFixture<STruckDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [STruckDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(STruckDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
