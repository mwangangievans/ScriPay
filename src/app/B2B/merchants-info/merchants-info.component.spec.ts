import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantsInfoComponent } from './merchants-info.component';

describe('MerchantsInfoComponent', () => {
  let component: MerchantsInfoComponent;
  let fixture: ComponentFixture<MerchantsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantsInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MerchantsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
