import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { trigger, state, style, transition, animate } from "@angular/animations"
import { Router, RouterModule } from "@angular/router"
import { LocalstorageService } from "../../../service/localstorage.service"
import { UserLoginData } from "../../../interface"
import { HttpService } from "../../../service/http.service"
import { CarouselSlide, LoginResponse } from "./login.interface"
import { AuthService } from "../../../service/auth.service"
import { NotificationService } from "../../../service/notification.service"
import { CommonModule } from "@angular/common"




@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  animations: [
    trigger("slideAnimation", [
      transition(":enter", [
        style({ transform: "translateX(300px)", opacity: 0, scale: 0.95 }),
        animate(
          "800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          style({ transform: "translateX(0)", opacity: 1, scale: 1 }),
        ),
      ]),
      transition(":leave", [
        animate(
          "800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          style({ transform: "translateX(-300px)", opacity: 0, scale: 0.95 }),
        ),
      ]),
    ]),
    trigger("fadeInUp", [
      transition(":enter", [
        style({ transform: "translateY(30px)", opacity: 0 }),
        animate("700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
    ]),
    trigger("scaleIn", [
      transition(":enter", [
        style({ transform: "scale(0)", opacity: 0 }),
        animate("500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)", style({ transform: "scale(1)", opacity: 1 })),
      ]),
    ]),
    trigger("buttonHover", [
      state("normal", style({ transform: "scale(1)" })),
      state("hovered", style({ transform: "scale(1.02)" })),
      transition("normal <=> hovered", animate("200ms ease-out")),
    ]),
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild("constraintsRef", { static: false }) constraintsRef!: ElementRef

  loginForm: FormGroup
  currentSlide = 0
  showPassword = false
  isLoading = false
  private intervalId: any
  private dragStartX = 0
  private isDragging = false


  carouselData: CarouselSlide[] = [
    {
      id: 1,
      title: "Receive payments from any banking system",
      subtitle: "Connect your bank card, and create accounts in the selected currency.",
      stats: { users: "2M+", transactions: "$50B+" },
      imageSrc: "assets/images/carousel-2.png",
      imageAlt: "Person with credit card and currency symbols",
      badgeIcon: "shield",
      badgeColor: "bg-green-500",
      badgePosition: "-top-2 -right-2",
    },
    {
      id: 2,
      title: "Send money globally with ease",
      subtitle: "Transfer funds to any country with competitive exchange rates and low fees.",
      stats: { countries: "180+", uptime: "99.9%" },
      imageSrc: "assets/images/carousel-1.png",
      imageAlt: "Woman interacting with large credit card",
      badgeIcon: "credit-card",
      badgeColor: "bg-blue-500",
      badgePosition: "-bottom-2 -left-2",
    },
    {
      id: 3,
      title: "Secure mobile transactions",
      subtitle: "Complete secure transactions on your mobile device with advanced encryption technology.",
      stats: { security: "256-bit", rating: "4.9★" },
      imageSrc: "assets/images/carousel-3.png",
      imageAlt: "Woman with mobile device showing secure transaction",
      badgeIcon: "lock",
      badgeColor: "bg-purple-500",
      badgePosition: "top-4 -right-2",
    },
  ]

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router

    , private localStorageService: LocalstorageService, private httpService: HttpService, private notify: NotificationService,

  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit() {
    this.startCarousel()
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.carouselData.length
    }, 3000)
  }

  goToSlide(index: number) {
    this.currentSlide = index
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  getEmailError(): string {
    const emailControl = this.loginForm.get("email")
    if (emailControl?.hasError("required") && emailControl?.touched) {
      return "Email is required"
    }
    if (emailControl?.hasError("email") && emailControl?.touched) {
      return "Please enter a valid email"
    }
    return ""
  }

  getPasswordError(): string {
    const passwordControl = this.loginForm.get("password")
    if (passwordControl?.hasError("required") && passwordControl?.touched) {
      return "Password is required"
    }
    if (passwordControl?.hasError("minlength") && passwordControl?.touched) {
      return "Password must be at least 6 characters"
    }
    return ""
  }

  isEmailValid(): boolean {
    const emailControl = this.loginForm.get("email")
    return (emailControl?.valid && emailControl?.value && emailControl?.touched) || false
  }

  isPasswordValid(): boolean {
    const passwordControl = this.loginForm.get("password")
    return (passwordControl?.valid && passwordControl?.value && passwordControl?.touched) || false
  }

  // async onSubmit() {
  //   console.log("Form submitted:", this.loginForm.value);

  //   if (this.loginForm.valid) {
  //     this.isLoading = true

  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 2000))

  //     this.isLoading = false
  //     console.log("Login attempt:", this.loginForm.value)
  //   } else {
  //     // Mark all fields as touched to show validation errors
  //     Object.keys(this.loginForm.controls).forEach((key) => {
  //       this.loginForm.get(key)?.markAsTouched()
  //     })
  //   }
  // }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    // Store data for later OTP use
    const otpVerificationData = {
      code: '0000',
      password,
      username: email,
      context: 'Verification',
    };

    this.localStorageService.set('pendingRegistration', otpVerificationData);

    const formData: UserLoginData = {
      username: email,
      password: password,
    };

    this.isLoading = true;
    this.httpService
      .post<LoginResponse>('authentication/login', formData, {
        showSuccessNotification: true,
        skipAuth: true,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          const loginData = response.body;
          if (loginData) {
            console.log('Login successful:', loginData);
            this.notify.showSuccess("Login successful", 'Success');
            this.localStorageService.set('userObject', loginData);
            this.authService.saveTokens(response.body.tokens.access_token, response.body.tokens.refresh_token);
            // if (response.body.is_merchant && response.body.merchant?.active) {
            //   debugger

            //   this.router.navigate(['/b2b/dashboard']);

            // } else {
            //   this.router.navigate(['/Onboarding']);
            // }
            this.router.navigate(['/b2b/dashboard']);


          }
        },
        error: (err) => {
          this.isLoading = false;

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
      });
  }


  resendCode(): void {


    const verificationData = {
      username: this.loginForm.value.email,
      context: "Verification"
    };



    this.httpService
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



  onDragStart(event: MouseEvent | TouchEvent) {
    this.isDragging = true
    this.dragStartX = this.getEventX(event)
  }

  onDragEnd(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return

    const dragEndX = this.getEventX(event)
    const dragDistance = dragEndX - this.dragStartX
    const threshold = 30

    if (dragDistance > threshold) {
      this.currentSlide = (this.currentSlide - 1 + this.carouselData.length) % this.carouselData.length
    } else if (dragDistance < -threshold) {
      this.currentSlide = (this.currentSlide + 1) % this.carouselData.length
    }

    this.isDragging = false
  }

  private getEventX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientX
    } else {
      return event.touches[0]?.clientX || 0
    }
  }

  getStatsEntries(stats: { [key: string]: string }): Array<[string, string]> {
    return Object.entries(stats)
  }

  getBadgeIconPath(icon: string): string {
    const icons: { [key: string]: string } = {
      shield: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      "credit-card": "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    }
    return icons[icon] || ""
  }
}
