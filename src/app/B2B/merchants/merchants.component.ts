import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpService } from '../../service/http.service';
import { Countries, Merchant, onbordingRequiremnetByCountry, Pagination } from '../B2B.interface';
// import { NgSelectModule } from '@ng-select/ng-select';
import { LocalstorageService } from '../../service/localstorage.service';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [MatStepperModule, MatIconModule, MatCardModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
})
export class MerchantsComponent implements OnInit, OnDestroy {
  activeStep = 0;
  businessInfoForm: FormGroup;
  ownerInfoForm: FormGroup;
  bankInfoForm: FormGroup;


  // Separate form submission states
  isBusinessInfoSubmitted = false;
  isOwnerInfoSubmitted = false;
  isBankInfoSubmitted = false;

  isLoading = false;
  merchants: Merchant[] = [];
  countries: Countries[] = [];
  kycRequiremnetByCountry: onbordingRequiremnetByCountry[] = [];

  private apiSubscriptions: Subscription[] = [];
  isBusinessInfoReadOnly = false;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private _LocalstorageService: LocalstorageService
  ) {
    this.businessInfoForm = this.createBusinessInfoForm();
    this.ownerInfoForm = this.createOwnerInfoForm();
    this.bankInfoForm = this.createBankInfoForm();
    this.getMerchants();
    this.getCountries()
  }

  private createBusinessInfoForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      location: ['', Validators.required],
      logo: [null]
    });
  }

  private createOwnerInfoForm(): FormGroup {
    return this.fb.group({
      country: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      nationalId: ['', Validators.required],
      personalEmail: ['', [Validators.required, Validators.email]],
      personalPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]]
    });
  }

  private createBankInfoForm(): FormGroup {
    return this.fb.group({
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
      branchCode: ['', Validators.required],
      currency: ['', Validators.required],
      swiftCode: ['']
    });
  }

  ngOnInit() {
    // Reset stepper to 1 and update globally
    this.activeStep = 0;
    this._LocalstorageService.set('activeStep', this.activeStep.toString());

    this.loadFormData('businessInfoForm', this.businessInfoForm);
    this.loadFormData('ownerInfoForm', this.ownerInfoForm);
    this.loadFormData('bankInfoForm', this.bankInfoForm);
  }

  private loadFormData(formKey: string, form: FormGroup) {
    const data = this._LocalstorageService.get(formKey);
    if (data) {
      try {
        form.setValue(JSON.parse(data));
      } catch (e) {
        console.error(`Error parsing saved form data for ${formKey}`, e);
      }
    }
  }

  ngOnDestroy() {
    this.apiSubscriptions.forEach(sub => sub.unsubscribe());
  }

  nextStep() {
    if (this.activeStep < 2) {
      this.activeStep++;
      this.saveCurrentState();
    }
  }

  prevStep() {
    if (this.activeStep > 0) {
      this.activeStep--;
      this.saveCurrentState();
    }
  }

  saveCurrentState() {
    this._LocalstorageService.set('activeStep', this.activeStep.toString());
    this._LocalstorageService.set('businessInfoForm', JSON.stringify(this.businessInfoForm.value));
    this._LocalstorageService.set('ownerInfoForm', JSON.stringify(this.ownerInfoForm.value));
    this._LocalstorageService.set('bankInfoForm', JSON.stringify(this.bankInfoForm.value));
  }

  onFileSelected(event: any) {
    if (!this.isBusinessInfoReadOnly) {
      const file: File = event.target.files[0];
      if (file) {
        this.businessInfoForm.get('logo')?.setValue(file);
      }
    }
  }

  submitBusinessInfo() {
    this.isBusinessInfoSubmitted = true;

    if (!this.merchants.length) {

      if (this.businessInfoForm.invalid) {
        this.businessInfoForm.markAllAsTouched();
        return;
      }

      this.isLoading = true;
      const formData = new FormData();
      const formValues = this.businessInfoForm.value;

      Object.keys(formValues).forEach(key => {
        if (key !== 'logo' && formValues[key] !== null) {
          formData.append(key, formValues[key]);
        }
      });

      const logoFile = this.businessInfoForm.get('logo')?.value;
      if (logoFile instanceof File) {
        formData.append('logo', logoFile, logoFile.name);
      }

      const subscription = this.httpService.post('onboarding/merchants', formData, {
        showSuccessNotification: true,
        skipAuth: false
      }).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.saveCurrentState();
          this.nextStep();
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('API error:', err);
        }
      });

      this.apiSubscriptions.push(subscription);
    } else {
      this.saveCurrentState();
      this.nextStep();
    }

  }

  submitOwnerInfo() {
    this.isOwnerInfoSubmitted = true;

    if (this.ownerInfoForm.invalid) {
      this.ownerInfoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    const formValues = this.ownerInfoForm.value;

    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null) {
        formData.append(key, formValues[key]);
      }
    });

    const subscription = this.httpService.post('merchant/owner-info', formData, {
      showSuccessNotification: true,
      skipAuth: false
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.saveCurrentState();
        this.nextStep();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('API error:', err);
      }
    });

    this.apiSubscriptions.push(subscription);
  }

  submitBankInfo() {
    this.isBankInfoSubmitted = true;

    if (this.bankInfoForm.invalid) {
      this.bankInfoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    const formValues = this.bankInfoForm.value;

    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null) {
        formData.append(key, formValues[key]);
      }
    });

    const subscription = this.httpService.post('merchant/bank-info', formData, {
      showSuccessNotification: true,
      skipAuth: false
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.saveCurrentState();
        console.log('All forms submitted successfully!');
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('API error:', err);
      }
    });

    this.apiSubscriptions.push(subscription);
  }

  getMerchants(): void {
    this.merchants = [];
    const url = 'onboarding/merchants';

    const subscription = this.httpService.get<Pagination<Merchant>>(url).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.results && response.body.results.length > 0) {
          this.merchants = response.body.results;
          this._LocalstorageService.set('merchants', JSON.stringify(this.merchants));

          const merchant = this.merchants[0];
          this.businessInfoForm.patchValue({
            name: merchant.name,
            email: merchant.email,
            address: merchant.address,
            location: merchant.location,
            logo: merchant.logo
          });

          this._LocalstorageService.set('businessInfoForm', JSON.stringify(this.businessInfoForm.value));
          this.isBusinessInfoReadOnly = true;
          this.businessInfoForm.disable();
        } else {
          this.businessInfoForm = this.createBusinessInfoForm();
          this.isBusinessInfoReadOnly = false;
          this._LocalstorageService.remove('businessInfoForm');
        }
      },
      error: (error) => {
        console.error('Error fetching merchants:', error);
        this.businessInfoForm = this.createBusinessInfoForm();
        this.isBusinessInfoReadOnly = false;
        this._LocalstorageService.remove('businessInfoForm');
      }
    });

    this.apiSubscriptions.push(subscription);
  }

  getCountries(): void {
    this.countries = [];
    const url = 'settings/counties';

    const subscription = this.httpService.get<Pagination<Countries>>(url).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.results && response.body.results.length > 0) {
          this.countries = response.body.results;

        }
      },
      error: (error) => {

      }
    });

    this.apiSubscriptions.push(subscription);
  }

  // getRequirementsByCountry(event: Event): void {
  //   const countryId = (event.target as HTMLSelectElement).value;
  //   if (countryId) {
  //     this.countries = [];
  //     const url = `onboarding/requirements?country__id=${countryId}`;

  //     const subscription = this.httpService.get<Pagination<onbordingRequiremnetByCountry>>(url).subscribe({
  //       next: (response) => {
  //         if (response.status === 200 && response.body?.results && response.body.results.length > 0) {
  //           this.kycRequiremnetByCountry = response.body.results;

  //         }
  //       },
  //       error: (error) => {

  //       }
  //     });

  //     this.apiSubscriptions.push(subscription);
  //   }


  // }

  getRequirementsByCountry(countryId: number): void {
    console.log('Selected countryId:', countryId);
    if (countryId) {
      const url = `onboarding/requirements?country__id=${countryId}`;
      const subscription = this.httpService
        .get<Pagination<onbordingRequiremnetByCountry>>(url)  // Make sure the interface name is correct
        .subscribe({
          next: (response) => {
            if (response.status === 200 && response.body?.results?.length) {
              this.kycRequiremnetByCountry = response.body.results;
              console.log('API response:', response.body.results);
            } else {
              this.kycRequiremnetByCountry = []; // Clear if no results
            }
          },
          error: (error) => {
            console.error('API error:', error);
            this.kycRequiremnetByCountry = [];
          },
        });

      this.apiSubscriptions.push(subscription);
    }
  }



}
