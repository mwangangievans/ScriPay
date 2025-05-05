import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardB2bComponent } from './dashboard-b2b.component';

describe('DashboardB2bComponent', () => {
  let component: DashboardB2bComponent;
  let fixture: ComponentFixture<DashboardB2bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardB2bComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
