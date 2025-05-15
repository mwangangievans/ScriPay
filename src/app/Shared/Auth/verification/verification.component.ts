import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { otpVerificationData, UserRegistration } from '../../../interface';
import { LocalstorageService } from '../../../service/localstorage.service';
import { VerificationService } from '../../../service/verification.service';
import { OtpInputComponent } from "../../Custom/otp-input/otp-input.component";
import { HttpService } from '../../../service/http.service';
import { LoaderService } from '../../../service/loader.service';


@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, OtpInputComponent],
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  @ViewChild(OtpInputComponent) otpInputComponent!: OtpInputComponent;

  registerForm: FormGroup;
  private subscription: Subscription | null = null;
  public userData!: otpVerificationData
  private readonly STORAGE_KEY = 'pendingRegistration';
  isLoading = this.loaderService.loading$;
  countdown: number = 60;
  private countdownInterval: any;


  constructor(
    private router: Router,
    private localStorageService: LocalstorageService,
    private verificationService: VerificationService,
    private httpService: HttpService,
    private loaderService: LoaderService,


  ) {
    this.registerForm = new FormGroup({
      code: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^[0-9]+$/)
      ])
    });
  }

  ngOnInit(): void {
    this.startCountdown();

    // First try to get from state (works on direct navigation)
    const navigation = this.router.getCurrentNavigation();
    this.userData = navigation?.extras.state?.['user'] as UserRegistration;

    // If no state (page refresh), try localStorage
    if (!this.userData) {
      this.userData = this.localStorageService.get(this.STORAGE_KEY);
    }

    if (!this.userData) {
      console.error('No user data available');
      this.router.navigate(['/register']);
      return;
    }
  }

  getControl(controlName: string): FormControl {
    return this.registerForm.get(controlName) as FormControl;
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid || !this.userData) {
      return;
    }

    const verificationData = {
      password: this.userData.password,
      code: this.registerForm.value.code
    };

    this.subscription = this.httpService
      .post<any>('authentication/verify-code', verificationData, {
        showSuccessNotification: true
      })
      .subscribe({
        next: (res: any) => {
          this.stopCountdown();

          if (res.status === 200) {
            this.router.navigate(['/login'], {
              state: { user: this.userData }
            });
          }
        },
        error: (err: any) => {
          this.stopCountdown();

          this.otpInputComponent?.resetOtp();

          // Optionally mark it as untouched/pristine
          this.getControl('code').markAsUntouched();
          this.getControl('code').markAsPristine();
        }
      });
  }

  // Add this new helper method
  stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.countdown = 0; // Set to 0 to enable resend immediately
  }




  handleOtpFilled(value: string): void {
    this.registerForm.patchValue({ code: value });
    this.getControl('code').markAsTouched();
    // Optionally trigger validation
    this.getControl('code').updateValueAndValidity();
  }

  startCountdown() {
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  resendCode(): void {
    if (!this.userData || this.countdown > 0) return;


    const verificationData = {
      username: this.userData.username,
      context: this.userData.context
    };



    this.subscription = this.httpService
      .post<any>('authentication/request-code', verificationData, {
        showSuccessNotification: true
      })
      .subscribe({
        next: (res: any) => {
          // Stop the countdown regardless of success
          this.stopCountdown();

          if (res.status === 200) {
            // this.router.navigate(['/dashboard']);
          }
        },
        error: (err: any) => {
          this.stopCountdown();
          this.registerForm.get('code')?.reset();
          this.getControl('code').markAsUntouched();
          this.getControl('code').markAsPristine();

          // Reset the OTP input UI
          this.otpInputComponent?.resetOtp();
        }

      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
