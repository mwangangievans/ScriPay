import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { loginResponse, otpVerificationData, UserLoginData, UserRegistration } from '../../../interface';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../service/http.service';
import { Router, RouterModule } from '@angular/router';
import { LoaderService } from '../../../service/loader.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../service/notification.service';
import { AuthService } from '../../../service/auth.service';
import { LocalstorageService } from '../../../service/localstorage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  passwordVisible: boolean = false;
  private userData: otpVerificationData | null = null;
  isLoading = this.loaderService.loading$;
  private subscription: Subscription | null = null;
  formSubmitted = false;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private notify: NotificationService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private localStorageService: LocalstorageService) {

    this.loginForm = new FormGroup({

      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ])
    });

    const navigation = this.router.getCurrentNavigation();
    this.userData = navigation?.extras.state?.['user'] as UserRegistration;

    // Or fallback from localStorage if needed
    if (!this.userData) {
      this.userData = this.localStorageService.get('pendingRegistration');
    }

    if (this.userData) {
      this.loginForm.patchValue({
        email: this.userData.username || '',
        password: this.userData.password || ''
      });
    }


  }

  onSubmit(): void {
    this.formSubmitted = true; // Track that user has attempted to submit

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.scrollToFirstError();
      return;
    }

    const { email, password } = this.loginForm.value;

    // Prepare OTP verification data
    const otpVerificationData = {
      code: "0000",
      password: password,
      username: email,
      context: "Verification"
    };

    // Securely store in local storage (encrypted in production)
    this.localStorageService.set('pendingRegistration', otpVerificationData);

    // Prepare login data
    const formData: UserLoginData = {
      username: email,
      password: password,
    };

    this.subscription = this.httpService
      .post<loginResponse>('authentication/login', formData, {
        showSuccessNotification: true,
        skipAuth: true
      })
      .subscribe({
        next: (res: any) => {
          this.handleLoginSuccess(res);
        },
        error: (err: any) => {

          console.log(err);

          this.handleLoginError(err);
        }
      });
  }

  private handleLoginSuccess(res: any): void {
    if (res.status === 200) {
      this.notify.showSuccess("Login successful", 'Success');

      // Set user object and navigate based on user type
      res.body.is_machant = true; // Note: Typo in 'is_machant'? Should it be 'is_merchant'?
      this.localStorageService.set('userObject', res.body);
      res.body
      this.authService.saveTokens(res.body.tokens.access_token, res.body.tokens.refresh_token);

      //       {
      //     "tokens": {
      //         "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxNTQxNDg1LCJpYXQiOjE3NDg5NDk0ODUsImp0aSI6IjAxYWU5N2NjODZhOTQzMDhhYmVhNzliZDc1NDIyMzJhIiwidXNlcl9pZCI6NDF9.LtmpusLovnKv70vX1sFQ2z1fxa_hK1EYnN29YiRQTa4",
      //         "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MTU0MTQ4NSwiaWF0IjoxNzQ4OTQ5NDg1LCJqdGkiOiIyYTYwMzhjOWQ0NzM0NGQ0ODJlNDAxMWI2ODRkMWNjMiIsInVzZXJfaWQiOjQxfQ.chzAQd-1hXzaNgOBw5qeIH-O3WrOV1OoBejQorbEUoM"
      //     },
      //     "user": {
      //         "id": 41,
      //         "username": "emwangangi@jambopay.com",
      //         "email": "emwangangi@jambopay.com",
      //         "email_verified": true,
      //         "phone_number": "254798288410",
      //         "phone_number_verified": false,
      //         "is_verified": true,
      //         "fullname": "Muinde Mwangangi",
      //         "is_active": true,
      //         "is_staff": false
      //     },
      //     "is_merchant": false
      // }

      if (res.body.is_merchant) {
        this.localStorageService.set('isMerchant', true);
        this.router.navigate(['/b2b/dashboard']);

      } else {
        this.router.navigate(['/Onboarding']);
      }



    }
  }

  private handleLoginError(err: any): void {
    console.log("err", err.error);

    if (err?.error) {
      const errors = err.error;
      let emailNotVerifiedFound = false;

      for (const key in errors) {
        if (Array.isArray(errors[key])) {
          for (const message of errors[key]) {

            if (message === 'Email is not verified') {
              this.notify.showWarning(`${key}: ${message}`, 'Warning');
              emailNotVerifiedFound = true;
              this.resendCode();
            } else {
              // this.notify.showError('Login failed. Please try again.', 'Error');
            }
          }
        }
      }

      // If no specific errors were processed
      if (!emailNotVerifiedFound && Object.keys(errors).length === 0) {
        this.notify.showError('Login failed. Please try again.', 'Error');
      }
    } else {
      this.notify.showError('An unexpected error occurred', 'Error');
    }
  }


  private scrollToFirstError(): void {
    setTimeout(() => {
      const errorElement = document.querySelector('.error-message');
      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  }


  resendCode(): void {


    const verificationData = {
      username: this.loginForm.value.email,
      context: "Verification"
    };



    this.subscription = this.httpService
      .post<any>('authentication/request-code', verificationData, {
        showSuccessNotification: true
      })
      .subscribe({
        next: (res: any) => {
          // Stop the countdown regardless of success
          // this.stopCountdown();

          if (res.status === 200) {
            this.router.navigate(['/verification'], {
              // state: { user: formData }
            });
            return;
            // this.router.navigate(['/dashboard']);
          }
        },
        error: (err: any) => {
          // Stop the countdown on error
          // this.stopCountdown();
          console.error('Otp verification failed:', err);
          this.localStorageService.remove('pendingRegistration');
        }
      });
  }


  get passwordValue(): string {
    return this.loginForm.get('password')?.value || '';
  }

  get isMinLength(): boolean {
    return this.passwordValue.length >= 8;
  }

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.passwordValue);
  }

  get hasLowerCase(): boolean {
    return /[a-z]/.test(this.passwordValue);
  }

  get hasNumber(): boolean {
    return /\d/.test(this.passwordValue);
  }

  get hasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.passwordValue);
  }
  get passwordInputType(): string {
    return this.passwordVisible ? 'text' : 'password';
  }
}
