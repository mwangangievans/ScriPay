import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalstorageService } from '../../service/localstorage.service';
import { OnboardingService } from '../../service/onboarding.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../../service/http.service';
import { UserObject } from '../../Shared/Auth/user.interface';
import { Merchant, Pagination } from '../B2B.interface';

@Component({
  selector: 'app-merchants-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ])
  ],
  templateUrl: './merchants-info.component.html',
  styleUrls: ['./merchants-info.component.css']
})
export class MerchantsInfoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  Merchant!: Merchant
  selectedLogo: File | null = null;
  currentStep: number = 1;
  isLoading: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private subscription: Subscription = new Subscription();
  userObject: UserObject;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalstorageService,
    private onboardingService: OnboardingService,
    private httpService: HttpService
  ) {
    this.userObject = this.localStorageService.get('userObject');
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      location: ['', Validators.required],
      logo: [null]
    });

    if (this.userObject?.is_merchant && this.userObject.merchant) {
      this.form.patchValue({
        name: this.userObject.merchant.name,
        email: this.userObject.merchant.email,
        address: this.userObject.merchant.address,
        location: this.userObject.merchant.location,
        logo: this.userObject.merchant.logo
      });
    }
  }

  ngOnInit() {
    this.currentStep = 1    // this.getMerchant();
    this.subscription.add(
      this.form.statusChanges.subscribe(status => {
        this.localStorageService.set('merchantInfoFormData', JSON.stringify(this.form.value));
        this.onboardingService.setStepValidity(1, status === 'VALID');
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadFormData() {
    this.userObject = this.localStorageService.get('userObject');
    if (this.userObject && this.userObject.is_merchant && !this.userObject.merchant.active) {
      this.form?.patchValue({
        name: this.userObject.merchant.name,
        email: this.userObject.merchant.email,
        address: this.userObject.merchant.address,
        location: this.userObject.merchant.location,
        logo: this.userObject.merchant.logo,
      });
    }
    // this.onboardingService.completeStep(1);

    const savedData = this.localStorageService.get('merchantInfoFormData');
    if (savedData) {
      try {
        this.form?.patchValue(JSON.parse(savedData));
      } catch (e) {
        console.error('Error parsing saved merchant info form data', e);
      }
    }
  }
  getMerchant() {
    this.subscription.add(
      this.httpService.get<Pagination<Merchant>>('onboarding/merchants', { showSuccessNotification: true })
        .subscribe({
          next: (response) => {
            console.log({ response });

            if (response.status === 200 && response.body?.results?.length) {
              this.Merchant = response.body.results[0]
              this.userObject.merchant = this.Merchant
              this.localStorageService.set('userObject', this.userObject);
              this.loadFormData()
              this.onboardingService.completeStep(1);
            } else {
              console.error('Merchant info submission failed or no results found');
            }
          },
          error: (error) => {
            console.error('Error submitting merchant info:', error);
          },
          complete: () => {
            this.isLoading = false;
          }
        })
    );
  }
  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.selectedLogo = file;
      this.form.patchValue({ logo: file });
      this.onboardingService.setSelectedLogo(file ? { name: file.name } : null);
    }
  }

  onFormSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    // If merchant already exists, skip API call and go to next step
    if (this.userObject?.is_merchant && this.userObject.merchant) {
      this.onboardingService.completeStep(1);
      console.log('[MerchantsInfoComponent] completeStep(1) called (merchant exists)'); // DEBUG LOG
      // Remove extra subscription to state$ here to avoid memory leaks
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    Object.keys(this.form.value).forEach(key => {
      formData.append(key, this.form.value[key]);
    });

    this.subscription.add(
      this.httpService.post('onboarding/merchants', formData, { showSuccessNotification: true })
        .subscribe({
          next: (response) => {
            if (response.status === 200) {
              this.getMerchant();
              this.onboardingService.completeStep(1);
              console.log('[MerchantsInfoComponent] completeStep(1) called (merchant created)'); // DEBUG LOG
            } else {
              console.error('Merchant info submission failed');
            }
          },
          error: (error) => {
            console.error('Error submitting merchant info:', error);
          },
          complete: () => {
            this.isLoading = false;
          }
        })
    );
  }

  goToPreviousStep() {
    this.onboardingService.goToPreviousStep();
  }
}
