import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalstorageService } from '../../service/localstorage.service';
import { CommonModule } from '@angular/common';

interface StepData {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Country {
  value: string;
  label: string;
}

interface Currency {
  value: string;
  label: string;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class OnboardingComponent implements OnboardingComponent {
  onClick(arg0: string) {
    console.log(`Button clicked: ${arg0}`);
  }
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  steps: StepData[] = [
    {
      id: 1,
      title: 'Business Information',
      description: 'Tell us about your business',
      icon: 'Building2',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 2,
      title: 'Owner Details',
      description: 'Personal information required',
      icon: 'User',
      color: 'from-violet-500 to-purple-600',
    },
    {
      id: 3,
      title: 'Banking Information',
      description: 'Setup your payment details',
      icon: 'CreditCard',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 4,
      title: 'Verification',
      description: 'Secure your verification details',
      icon: 'Shield',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  countries: Country[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];

  currencies: Currency[] = [
    { value: 'usd', label: 'USD - US Dollar' },
    { value: 'eur', label: 'EUR - Euro' },
    { value: 'gbp', label: 'GBP - British Pound' },
    { value: 'cad', label: 'CAD - Canadian Dollar' },
    { value: 'aud', label: 'AUD - Australian Dollar' },
  ];

  currentStep: number = 1;
  completedSteps: number[] = [];
  isLoading: boolean = false;
  selectedLogo: File | null = null;
  email: string | null = null;
  businessInfoForm!: FormGroup;
  ownerInfoForm!: FormGroup;
  bankInfoForm!: FormGroup;
  authForm!: FormGroup;

  constructor(private fb: FormBuilder, private localStorageService: LocalstorageService) {
    this.initializeForms();
  }

  private initializeForms() {
    this.businessInfoForm = this.fb.group({
      businessName: ['', Validators.required],
      businessEmail: ['', [Validators.required, Validators.email]],
      businessAddress: ['', Validators.required],
      businessLocation: ['', Validators.required],
    });
    this.ownerInfoForm = this.fb.group({
      country: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      nationalId: ['', Validators.required],
      personalEmail: ['', [Validators.required, Validators.email]],
      personalPhone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
    });
    this.bankInfoForm = this.fb.group({
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
      branchCode: ['', Validators.required],
      currency: ['', Validators.required],
      swiftCode: [''],
    });
    this.authForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit() {
    const savedStep = this.localStorageService.get('step');
    if (savedStep) {
      this.currentStep = parseInt(savedStep);
    }
    this.loadFormData('businessInfoFormData', this.businessInfoForm);
    this.loadFormData('ownerInfoFormData', this.ownerInfoForm);
    this.loadFormData('bankInfoFormData', this.bankInfoForm);
    this.loadFormData('authFormData', this.authForm);
  }

  private loadFormData(formKey: string, form: FormGroup | undefined) {
    const savedData = this.localStorageService.get(formKey);
    if (savedData && form) {
      try {
        form.setValue(JSON.parse(savedData));
        if (formKey === 'businessInfoFormData' && form.get('businessEmail')?.value) {
          this.email = form.get('businessEmail')?.value;
        }
      } catch (e) {
        console.error(`Error parsing saved form data for ${formKey}`, e);
      }
    }
  }

  saveCurrentState() {
    this.localStorageService.set('step', this.currentStep.toString());
    if (this.businessInfoForm) {
      this.localStorageService.set('businessInfoFormData', JSON.stringify(this.businessInfoForm.value));
      this.email = this.businessInfoForm.get('businessEmail')?.value || null;
    }
    if (this.ownerInfoForm) {
      this.localStorageService.set('ownerInfoForm', JSON.stringify(this.ownerInfoForm.value));
    }
    if (this.bankInfoForm) {
      this.localStorageService.set('bankInfoForm', JSON.stringify(this.bankInfoForm.value));
    }
    if (this.authForm) {
      this.localStorageService.set('authForm', JSON.stringify(this.authForm.value));
    }
  }

  triggerFileInput() {
    this.fileInput?.nativeElement?.click();
  }

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.selectedLogo = file;
      this.saveCurrentState();
    }
  }

  async submitStep(step: number) {
    let form: FormGroup | undefined;
    switch (step) {
      case 1:
        form = this.businessInfoForm;
        break;
      case 2:
        form = this.ownerInfoForm;
        break;
      case 3:
        form = this.bankInfoForm;
        break;
      case 4:
        form = this.authForm;
        break;
    }

    if (form && form?.invalid) {
      form?.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.completedSteps = [...this.completedSteps, step];
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
    this.saveCurrent();
    this.isLoading = false;
  }
  saveCurrent() {
    throw new Error('Method not implemented.');
  }

  handlePrevious() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.saveCurrentState();
    }
  }

  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.businessInfoForm?.valid || false;
      case 2:
        return this.ownerInfoForm?.valid || false;
      case 3:
        return this.bankInfoForm?.valid || false;
      case 4:
        return this.authForm?.valid || false;
      default:
        return false;
    }
  }

  getStepClass(step: any): { [klass: string]: boolean } {
    return {
      'bg-green-500 border-green-500 text-white': this.completedSteps.includes(step.id),
      'bg-gradient-to-r text-white shadow-lg': this.currentStep === step.id,
      'border-transparent': this.currentStep === step.id,
      'bg-white border-gray-300 text-gray-400': !this.completedSteps.includes(step.id) && this.currentStep !== step.id,
      [step.color]: this.currentStep === step.id // Now valid!
    };
  }

  sanitizeOtpInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const sanitized = input.replace(/\D/g, '').slice(0, 6);
    this.authForm.get('otp')?.setValue(sanitized);
  }


}
