import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpService } from '../../../service/http.service';
import { LoaderService } from '../../../service/loader.service';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { otpVerificationData, UserRegistration } from '../../../interface';
import { LocalstorageService } from '../../../service/localstorage.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent implements OnDestroy {
  registerForm: FormGroup;
  passwordVisible: boolean = false;
  _otpVerificationData!: otpVerificationData
  formSubmitted = false;


  isLoading = this.loaderService.loading$;
  private subscription: Subscription | null = null;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private loaderService: LoaderService,
    private localStorageService: LocalstorageService
  ) {
    this.registerForm = new FormGroup({
      fullname: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]),
      phone_number: new FormControl('', [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(15),
        Validators.pattern(/^\+?[0-9]+$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ])
    });
  }

  getControl(controlName: string): FormControl {
    return this.registerForm.get(controlName) as FormControl;
  }

  onSubmit(): void {

    this.formSubmitted = true; // Track that user has attempted to submit

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.scrollToFirstError();
      return;
    }
    const otpVerificationData = {
      code: "0000",
      password: this.registerForm.value.password,
      username: this.registerForm.value.email,
      context: "Verification"
    }

    // Securely store in local storage (encrypted in production)
    this.localStorageService.set('pendingRegistration', otpVerificationData);

    this.subscription = this.httpService
      .post<any>('authentication/register', this.registerForm.value, {
        showSuccessNotification: true,
        skipAuth: true
      })
      .subscribe({
        next: (res: any) => {
          if (res.status === 201) {
            this.router.navigate(['/verification'], {
              state: { user: otpVerificationData }
            });
          }
        },
        error: (err: any) => {
          console.error('Registration failed:', err);
          this.localStorageService.remove('pendingRegistration');
        }
      });
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  get passwordValue(): string {
    return this.registerForm.get('password')?.value || '';
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
