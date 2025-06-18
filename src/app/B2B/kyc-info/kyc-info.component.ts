import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { LocalstorageService } from '../../service/localstorage.service';
import { OnboardingService } from '../../service/onboarding.service';
import { CountrySelectorComponent } from '../../Shared/Custom/country-selector/country-selector.component';
import { DynamicFormFieldComponent } from '../../Shared/Custom/dynamic-form-field/dynamic-form-field.component';
import { HttpService } from '../../service/http.service';
import { UserObject } from '../../Shared/Auth/user.interface';

export interface Countries {
  id: number;
  name: string;
  code: number;
  currency: string;
  logo: string;
  timezone: string;
  active: boolean;
  created_at: string;
  modified_at: string;
}

export interface DynamicField {
  id: number;
  field_name: string;
  field_type: 'Text' | 'Email' | 'Phone' | 'Number' | 'Date' | 'Textarea' | 'Select' | 'Checkbox' | 'Radio' | 'File';
  required: boolean;
  active: boolean;
  country: number;
  options?: string[];
  placeholder?: string;
}

export interface Pagination<T> {
  status: number;
  results: T[];
  count: number;
}

@Component({
  selector: 'app-kyc-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CountrySelectorComponent,
    DynamicFormFieldComponent
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
  templateUrl: './kyc-info.component.html',
  styleUrls: ['./kyc-info.component.css']
})
export class KycInfoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  countries: Countries[] = [];
  fields: DynamicField[] = [];
  currentStep: number = 2;
  isLoading: boolean = false;
  userObject: UserObject;
  private apiSubscriptions: Subscription[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalstorageService,
    private onboardingService: OnboardingService,
    private httpService: HttpService
  ) {
    this.userObject = this.localStorageService.get('userObject');
    this.form = this.fb.group({
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFormData();
    this.getCountries();
    this.subscription.add(
      this.form.statusChanges.subscribe(status => {
        this.localStorageService.set('kycInfoFormData', JSON.stringify(this.form.value));
        this.onboardingService.setStepValidity(2, status === 'VALID');
      })
    );
  }

  ngOnDestroy(): void {
    this.apiSubscriptions.forEach(sub => sub.unsubscribe());
    this.subscription.unsubscribe();
    this.form.reset();
    this.countries = [];
  }

  private loadFormData() {
    const savedData = this.localStorageService.get('kycInfoFormData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.form.patchValue(data);
        if (data.country) {
          this.getFieldsByCountry(data.country);
        }
      } catch (e) {
        console.error('Error parsing saved KYC form data', e);
      }
    }
  }

  getCountries(): void {
    const url = 'settings/counties';
    const subscription = this.httpService.get<Pagination<Countries>>(url).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.results) {
          this.countries = response.body.results;
        }
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
      }
    });
    this.apiSubscriptions.push(subscription);
  }

  getFieldsByCountry(countryId: number): void {
    const url = `onboarding/requirements?country__id=${countryId}`;
    const subscription = this.httpService.get<Pagination<DynamicField>>(url).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.results) {
          this.fields = response.body.results;
          this.updateFormControls();
        }
      },
      error: (error) => {
        console.error('Error fetching fields:', error);
      }
    });
    this.apiSubscriptions.push(subscription);
  }

  updateFormControls(): void {
    Object.keys(this.form.controls).forEach(key => {
      if (key !== 'country') {
        this.form.removeControl(key);
      }
    });

    this.fields.forEach(field => {
      const controlName = this.convertToSnakeCase(field.field_name);
      const validators = field.required ? [Validators.required] : [];
      if (field.field_name === 'KRA Number') {
        validators.push(Validators.pattern(/^[A-Z0-9]{10,11}$/));
      } else if (field.field_type === 'Email') {
        validators.push(Validators.email);
      }
      this.form.addControl(controlName, new FormControl('', validators));
    });
  }

  onCountrySelected(country: Countries): void {
    this.form.get('country')?.setValue(country.id);
    this.getFieldsByCountry(country.id);
  }

  getCountryError(): string {
    const countryControl = this.form.get('country');
    if (countryControl?.hasError('required') && countryControl?.touched) {
      return 'Country is required';
    }
    return '';
  }

  convertToSnakeCase(input: string): string {
    return input.toLowerCase().replace(/\s+/g, '_');
  }

  getFormControl(field: DynamicField): FormControl {
    const control = this.form.get(this.convertToSnakeCase(field.field_name));
    return control as FormControl;
  }

  getFieldError(field: DynamicField): string {
    const control = this.getFormControl(field);
    if (control?.invalid && control?.touched) {
      if (control.hasError('required')) return `${field.field_name} is required`;
      if (control.hasError('email')) return 'Please enter a valid email address';
      if (control.hasError('pattern')) return `Invalid ${field.field_name.toLowerCase()} format`;
    }
    return '';
  }

  private prepareFieldData(field: DynamicField, controlValue: any): object {
    if (!this.userObject?.merchant?.id) {
      throw new Error('User merchant ID is not available');
    }

    return {
      mapper: field.id,
      merchant: this.userObject.merchant.id,
      [field.field_type === 'File' ? 'file_value' : 'text_value']: controlValue
    };
  }

  async onFieldSubmit(field: DynamicField): Promise<void> {
    const controlName = this.convertToSnakeCase(field.field_name);
    const control = this.form.get(controlName);

    if (!control?.valid) {
      control?.markAsTouched();
      return;
    }

    this.isLoading = true;
    try {
      const fieldData = this.prepareFieldData(field, control.value);
      const response = await this.httpService.post('onboarding/kycs', fieldData).toPromise();
      if (response?.status === 200) {
        control.markAsUntouched();
      } else {
        console.error(`Submission failed for ${field.field_name}`);
      }
    } catch (error) {
      console.error(`Error submitting ${field.field_name}:`, error);
    } finally {
      this.isLoading = false;
    }
  }

  async onFormSubmit(): Promise<void> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    try {
      const response = await this.httpService.post('onboarding/kycs', this.form.value).toPromise();
      if (response?.status === 200) {
        this.onboardingService.completeStep(2);
      } else {
        console.error('KYC submission failed');
      }
    } catch (error) {
      console.error('Error submitting KYC form:', error);
    } finally {
      this.isLoading = false;
    }
  }

  goToPreviousStep() {
    this.onboardingService.goToPreviousStep();
  }

  getSelectedCountryLogo(): string {
    const selectedId = this.form.get('country')?.value;
    const country = this.countries.find(c => c.id === selectedId);
    return country?.logo || '';
  }

  getSelectedCountryName(): string {
    const selectedId = this.form.get('country')?.value;
    const country = this.countries.find(c => c.id === selectedId);
    return country?.name || '';
  }
}
