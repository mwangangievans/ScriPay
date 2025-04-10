import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../Custom/text-input/text-input.component';
import { RouterModule } from '@angular/router';




@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FormsModule,TextInputComponent],
  
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})
export class VerificationComponent {
  carouselItems = [
    {
      image: 'https://source.unsplash.com/featured/?payment',
      title: 'Receive payments from any banking system',
      description: 'Connect your bank card, and create accounts in the selected currency.',
    },
    {
      image: 'https://source.unsplash.com/featured/?creditcard',
      title: 'Secure & Fast Transactions',
      description: 'Experience instant transfers with our advanced security features.',
    },
    {
      image: 'https://source.unsplash.com/featured/?banking',
      title: 'Multi-Currency Support',
      description: 'Easily switch between different currencies for seamless transactions.',
    }
  ];

   registerForm: FormGroup;
  
    constructor() {
      this.registerForm = new FormGroup(
        {
          code: new FormControl('', [Validators.required]),
  
        }
      );
    }
  
    getControl(controlName: string): FormControl {
      return this.registerForm.get(controlName) as FormControl;
    }
  
    onSubmit() {
      if (this.registerForm.valid) {
        
        console.log(this.registerForm.value);
        
      }
      
    }
}
