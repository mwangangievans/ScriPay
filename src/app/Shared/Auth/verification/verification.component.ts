import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from '../../Custom/text-input/text-input.component';



@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, FormsModule,TextInputComponent],
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
}
