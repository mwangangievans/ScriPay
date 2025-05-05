import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexB2bComponent } from './index-b2b.component';

describe('IndexB2bComponent', () => {
  let component: IndexB2bComponent;
  let fixture: ComponentFixture<IndexB2bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexB2bComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndexB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
