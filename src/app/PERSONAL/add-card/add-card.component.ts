import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css'
})
export class AddCardComponent {

  activeTab: 1 | 2  = 1;

updateTab(position:1|2 ){
this.activeTab = position
}

}
