import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-input',
      standalone: true,
      imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css']
})
export class PasswordInputComponent {
  @Input() label: string = 'Password';
  @Input() placeholder: string = 'Enter your password';
  @Input() control!: FormControl;
  @Input() errorMessages: { [key: string]: string } = {};

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  hasError(errorType: string): boolean {
    return this.control.hasError(errorType) && (this.control.dirty || this.control.touched);
  }

  get errorKeys(): string[] {
    return Object.keys(this.errorMessages);
  }
  
}
