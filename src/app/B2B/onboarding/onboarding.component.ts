import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormService } from '../../service/form.service';
import { Country, Currency, Step } from './onboarding.interface';
import { MerchantsInfoComponent } from "../merchants-info/merchants-info.component";
import { KycInfoComponent } from "../kyc-info/kyc-info.component";
import { LocalstorageService } from '../../service/localstorage.service';



@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MerchantsInfoComponent,
    KycInfoComponent
  ],
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
  steps: Step[] = [
    {
      id: 1,
      title: 'Merchant Information',
      description: 'Tell us about your business',
      icon: 'Building2',
      color: 'from-purple_dark to-purple_light'
    },
    {
      id: 2,
      title: 'Kyc Details',
      description: 'Submit kyc documents',
      icon: 'User',
      color: 'from-violet-500 to-purple-600'
    },
    {
      id: 3,
      title: 'Banking Information',
      description: 'Setup your payment details',
      icon: 'CreditCard',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 4,
      title: 'Verification',
      description: 'Secure your verification details',
      icon: 'Shield',
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  countries: Country[] = [
    { value: 'us', label: 'United States' },
    // Other countries...
  ];

  currencies: Currency[] = [
    { value: 'usd', label: 'USD - US Dollar' },
    // Other currencies...
  ];

  currentStep: number = 1;
  completedSteps: number[] = [];
  isLoading: boolean = false;
  selectedLogo: File | null = null;
  email: string | null = null;

  MerchantInfoForm: FormGroup;
  kycInfoForm: FormGroup;
  bankInfoForm: FormGroup;
  authForm: FormGroup;

  constructor(
    private formService: FormService,
    private localStorageService: LocalstorageService
  ) {
    this.MerchantInfoForm = this.formService.createMerchantInfoForm();
    this.kycInfoForm = this.formService.createkycInfoForm();
    this.bankInfoForm = this.formService.createBankInfoForm();
    this.authForm = this.formService.createAuthForm();
  }

  ngOnInit() {
    this.loadSavedState();
  }

  get progressPercentage(): number {
    return (this.completedSteps.length / this.steps.length) * 100;
  }

  private loadSavedState() {
    const savedStep = this.localStorageService.get('step');
    if (savedStep) {
      this.currentStep = parseInt(savedStep);
    }
    this.loadFormData('merchantInfoFormData', this.MerchantInfoForm);
    this.loadFormData('kycInfoFormData', this.kycInfoForm);
    this.loadFormData('bankInfoFormData', this.bankInfoForm);
    this.loadFormData('authFormData', this.authForm);
  }

  private loadFormData(formKey: string, form: FormGroup) {
    const savedData = this.localStorageService.get(formKey);
    if (savedData) {
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

  async submitStep(step: number) {
    const form = this.getFormForStep(step);
    if (form?.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.completedSteps = [...this.completedSteps, step];
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
    this.saveCurrentState();
    this.isLoading = false;
  }

  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.saveCurrentState();
    }
  }

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.selectedLogo = file;
      this.saveCurrentState();
    }
  }

  resendVerificationCode() {
    // Implement resend logic
  }

  private saveCurrentState() {
    this.localStorageService.set('step', this.currentStep.toString());
    this.saveFormData('merchantInfoFormData', this.MerchantInfoForm);
    this.saveFormData('kycInfoFormData', this.kycInfoForm);
    this.saveFormData('bankInfoFormData', this.bankInfoForm);
    this.saveFormData('authFormData', this.authForm);
  }

  private saveFormData(formKey: string, form: FormGroup) {
    if (form) {
      this.localStorageService.set(formKey, JSON.stringify(form.value));
      if (formKey === 'businessInfoFormData') {
        this.email = form.get('businessEmail')?.value || null;
      }
    }
  }

  isStepValid(): boolean {
    return this.getFormForStep(this.currentStep)?.valid || false;
  }

  private getFormForStep(step: number): FormGroup | undefined {
    switch (step) {
      case 1: return this.MerchantInfoForm;
      case 2: return this.kycInfoForm;
      case 3: return this.bankInfoForm;
      case 4: return this.authForm;
      default: return undefined;
    }
  }

  getStepClasses(step: Step): { [key: string]: boolean } {
    return {
      'bg-green-500 border-green-500 text-white': this.completedSteps.includes(step.id),
      'bg-gradient-to-r text-white shadow-lg': this.currentStep === step.id,
      'border-transparent': this.currentStep === step.id,
      'bg-white border-gray-300 text-gray-400': !this.completedSteps.includes(step.id) && this.currentStep !== step.id,
      [step.color]: this.currentStep === step.id
    };
  }


}
