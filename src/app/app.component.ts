import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { WindowService } from './Service/window.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ScriPay';

constructor(private windowService: WindowService){
  const win = this.windowService.nativeWindow;
  if (win) {
    console.log(win.innerHeight);
    initFlowbite();

  }
}

  // ngOnInit(): void {
  //   initFlowbite();
  // }
}
