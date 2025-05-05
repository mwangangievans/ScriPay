import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterB2bComponent } from './register-b2b.component';

describe('RegisterB2bComponent', () => {
  let component: RegisterB2bComponent;
  let fixture: ComponentFixture<RegisterB2bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterB2bComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
