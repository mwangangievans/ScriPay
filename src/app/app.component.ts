import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './Shared/home/home.component';
import { RegisterComponent } from './Shared/Auth/register/register.component';
import { RegisterFormComponent } from './Shared/Auth/register-form/register-form.component';
import { VerificationComponent } from './Shared/Auth/verification/verification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , HomeComponent ,RegisterComponent,RegisterFormComponent ,VerificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ScriPay';
}
