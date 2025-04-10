import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-cards',
  standalone: true,
  imports: [CommonModule , RouterModule],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css'
})
export class MyCardsComponent {

  transactions = [
    {
      id: 1,
      name: 'Spotify',
      icon: '/assets/icons/spotify-icon.png',
      amount: 'KES 2,500',
      date: 'Wed 3:00pm',
      status: 'Paid',
      account: {
        type: 'Visa',
        number: '1234',
        expiry: '06/2026',
        icon: '/assets/icons/spotify-icon.png',
      },
    },
    {
      id: 2,
      name: 'Invision',
      icon: '/assets/icons/Invision.png',
      amount: 'KES 5,000',
      date: 'Wed 1:00pm',
      status: 'Paid',
      account: {
        type: 'Mastercard',
        number: '1234',
        expiry: '06/2026',
        icon: '/assets/icons/Mastercard.png',
      },
    },
    {
      id: 3,
      name: 'Jira',
      icon: '/assets/icons/Jira.png',
      amount: 'KES 3,400',
      date: 'Mon 7:40pm',
      status: 'Pending',
      account: {
        type: 'Mastercard',
        number: '1234',
        expiry: '06/2026',
        icon: '/assets/icons/Mastercard.png',
      },
    },
  ];

}
