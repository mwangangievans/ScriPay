import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-merchants-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ])
  ],
  templateUrl: './merchants-info.component.html',
  styleUrl: './merchants-info.component.css'
})
export class MerchantsInfoComponent {
  @Input() form!: FormGroup;
  @Input() selectedLogo: File | null = null;
  @Output() onSubmit = new EventEmitter<void>();
  @Output() onFileUpload = new EventEmitter<Event>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

}
