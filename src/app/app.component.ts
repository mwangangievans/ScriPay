import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './Shared/Auth/register/register.component';
import { RegisterFormComponent } from './Shared/Auth/register-form/register-form.component';
import { VerificationComponent } from './Shared/Auth/verification/verification.component';
import { DashboardComponent } from './PERSONAL/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet  ,DashboardComponent ,RegisterComponent,RegisterFormComponent ,VerificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ScriPay';
}
