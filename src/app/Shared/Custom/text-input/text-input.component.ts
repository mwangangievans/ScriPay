import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent {
  @Input() placeholder: string = 'Enter text...';
  @Input() type: string = 'text';
  @Input() value: string = '';
  @Input() customClass: string = '';
  @Input() label: string = 'Label'; // Default label
  @Input() tooltip: string = 'Tooltip text'; // Default tooltip message
  @Input() control!: FormControl; // Ensure control is passed in
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() showIcon: boolean = false; // New input to toggle icon
  @Input() showLabel: boolean = false; // New input to toggle icon



  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }

  hasError(errorType: string): boolean {
    // Check if the control has the error and has been touched or dirty

    return this.control.hasError(errorType) && (this.control.dirty || this.control.touched);
  }

  get errorKeys(): string[] {

    return Object.keys(this.errorMessages);
  }
}
