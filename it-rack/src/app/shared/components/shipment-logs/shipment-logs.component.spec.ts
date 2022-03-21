import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentLogsComponent } from './shipment-logs.component';

describe('ShipmentLogsComponent', () => {
  let component: ShipmentLogsComponent;
  let fixture: ComponentFixture<ShipmentLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShipmentLogsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
