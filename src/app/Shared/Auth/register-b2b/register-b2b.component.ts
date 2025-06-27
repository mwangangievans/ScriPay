import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-b2b',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-b2b.component.html',
  styleUrl: './register-b2b.component.css'
})
export class RegisterB2bComponent {

  registrationForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
    // Add more countries as needed
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required]],
      businessName: ['', [Validators.required]],
      businessEmail: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      country: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Form submitted:', this.registrationForm.value);
      // Here you would typically call your authentication service
      // this.authService.register(this.registrationForm.value).subscribe(...)

      // Navigate to dashboard or verification page
      // this.router.navigate(['/dashboard']);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

}
