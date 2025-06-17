import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {

  transactions = [
    {
      id: -78632291,
      amount: "-.0",
      currency: "ex",
      status: "Cancelled",
      type: "Payout",
      created_at: "2017-02-20T18:11:14.851Z",
      provider_ref: "laborum anim",
      card_country: "?",
      site: "Demo website ex",
      email: "example@example.com"
    },
    {
      id: -70625684,
      amount: "8144",
      currency: "elit non",
      status: "Cancelled",
      purpose: "P2P",
      created_at: "1994-01-12T22:50:12.249Z",
      provider_ref: "fugiat nulla eu occaecat",
      card_country: "?",
      site: "Demo website elit non",
      email: "example@example.com"
    }
  ];
  currentPage = 1;

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    // Animate table rows on load
    gsap.from('tbody tr', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: 'tbody',
        start: 'top 80%'
      }
    });

    // Animate filter buttons on hover
    gsap.from('.flex > button', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.flex',
        start: 'top 90%'
      }
    });
  }

  getPaymentMethodIcon(providerRef: string): string {
    const icons = {
      'laborum anim': '💳 SEPA',
      'fugiat nulla eu occaecat': '💸 SEPA',
      'default': '💳 Unknown'
    };
    return icons['default'];
  }



}
