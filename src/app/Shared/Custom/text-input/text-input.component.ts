import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent {
  @Input() placeholder: string = 'Enter text...';
  @Input() type: string = 'text';
  @Input() value: string = '';
  @Input() customClass: string = '';
  @Input() label: string = 'Label'; // Default label
  @Input() tooltip: string = 'Tooltip text'; // Default tooltip message
  // @Input() type: string = 'text'; // Default input type
  // @Input() placeholder: string = 'Enter text'; // Default placeholder

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }
}
