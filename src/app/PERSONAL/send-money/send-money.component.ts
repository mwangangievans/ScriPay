import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './send-money.component.html',
  styleUrl: './send-money.component.css'
})
export class SendMoneyComponent {
  activeTab: 1 | 2 | 3 | 4 | 5| 6 = 1

  pinForm!: FormGroup;

  @ViewChildren('pinInput') pinInputs!: QueryList<ElementRef>;



  isProcessing = false;

  constructor(private fb: FormBuilder) {
    this.pinForm = this.fb.group({
      digit1: new FormControl(''),
      digit2: new FormControl(''),
      digit3: new FormControl(''),
      digit4: new FormControl(''),
    });
  }

  handleTransfer(position:1 | 2 | 3 | 4 | 5| 6) {
    this.activeTab = position
    this.isProcessing = true;

    // Simulate API call
    setTimeout(() => {
      this.isProcessing = false;
      // Handle successful transfer
      console.log('Transfer complete');
    }, 2000);
  }


  updateActiveTab(position: 1 | 2 | 3 | 4 | 5| 6){
    this.activeTab = position
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1 && index < 3) {
      this.pinInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && input.value.length === 0 && index > 0) {
      this.pinInputs.get(index - 1)?.nativeElement.focus();
    }
  }

  submitPin() {
    const pin = Object.values(this.pinForm.value).join('');
    alert(`Entered PIN: ${pin}`);
  }
}
