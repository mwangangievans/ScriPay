
import { DashboardComponent } from "./B2B/dashboard/dashboard.component";
import { RegisterFormComponent } from "./Shared/Auth/register-form/register-form.component";
import { VerificationComponent } from './Shared/Auth/verification/verification.component';
import { LoaderService } from './service/loader.service';
import { LoaderComponent } from "./Shared/loader/loader.component";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { DashboardB2bComponent } from './B2B/dashboard-b2b/dashboard-b2b.component';
import { WindowService } from "./service/window.service";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardB2bComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ScriPay';
  isLoading = this.loaderService.loading$;


  constructor(private windowService: WindowService, private loaderService: LoaderService) {
    const win = this.windowService.nativeWindow;
    if (win) {
      console.log(win.innerHeight);
      initFlowbite();

    }
  }




}
