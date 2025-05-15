import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.css'
})
export class OtpInputComponent {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  @Output() otpSubmit = new EventEmitter<string>();


  otpLength = 6;
  otpValues: string[] = new Array(this.otpLength).fill('');
  error = false;
  errorMessage = '';

  get otpArray() {
    return Array(this.otpLength);
  }

  ngAfterViewInit(): void {
    this.focusInput(0);
  }

  resetOtp(): void {
    this.otpValues.fill('');
    this.error = false;
    this.errorMessage = '';
    this.otpInputs.forEach(input => input.nativeElement.value = '');
    this.focusInput(0);
  }


  isDigitValid(char: string): boolean {
    return /^[0-9]$/.test(char);
  }

  onInput(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value;

    // If input is not a valid digit
    if (!this.isDigitValid(input)) {
      this.error = true;
      this.errorMessage = 'Only numbers are allowed';
      this.otpValues[index] = '';
      inputElement.value = '';  // Clear the input field immediately
      return;
    }

    this.error = false;
    this.errorMessage = '';

    // Update the value in the array
    this.otpValues[index] = input;

    if (input.length === 1 && index < this.otpLength - 1) {
      this.focusInput(index + 1);
    }

    this.checkOtpComplete();
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      if (!this.otpValues[index] && index > 0) {
        this.focusInput(index - 1);
      }
    }
  }

  focusInput(index: number): void {
    const inputs = this.otpInputs.toArray();
    if (inputs[index]) {
      inputs[index].nativeElement.focus();
    }
  }

  checkOtpComplete(): void {
    const otp = this.otpValues.join('');
    if (otp.length === this.otpLength && this.otpValues.every(v => this.isDigitValid(v))) {
      this.otpSubmit.emit(otp);
    }
  }

  onPaste(event: ClipboardEvent): void {
    const pastedData = event.clipboardData?.getData('text') ?? '';
    if (/^\d{4,6}$/.test(pastedData)) {
      this.otpValues = pastedData.split('').slice(0, this.otpLength);
      this.error = false;
      this.errorMessage = '';
      setTimeout(() => {
        this.checkOtpComplete();
      }, 0);
    } else {
      this.error = true;
      this.errorMessage = 'Only 4–6 digit numbers are allowed';
    }
    event.preventDefault();
  }

  resendOtp(): void {
    this.otpValues.fill('');
    this.error = false;
    this.errorMessage = '';
    this.focusInput(0);
    // Implement resend logic or emit event
  }
}
