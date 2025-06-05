import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { HttpService } from '../../service/http.service';
import { CountrySelectorComponent } from '../../Shared/Custom/country-selector/country-selector.component';
import { Pagination } from '../B2B.interface';
import { DynamicFormFieldComponent } from '../../Shared/Custom/dynamic-form-field/dynamic-form-field.component';

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

// export interface Pagination<T> {
//   status: number;
//   body: {
//     results: T[];
//     count: number;
//   };
// }

@Component({
  selector: 'app-kyc-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CountrySelectorComponent,
    DynamicFormFieldComponent // Added DynamicFormFieldComponent to imports
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
export class KycInfoComponent implements OnDestroy {
  @Input() form!: FormGroup;
  @Output() onSubmit = new EventEmitter<void>();
  countries: Countries[] = [];
  fields: DynamicField[] = [];
  private apiSubscriptions: Subscription[] = [];

  constructor(private httpService: HttpService) {
    this.getCountries();
  }

  ngOnDestroy(): void {
    this.apiSubscriptions.forEach(sub => sub.unsubscribe());
  }

  getCountries(): void {
    const url = 'settings/counties';
    const subscription = this.httpService.get<Pagination<Countries>>(url).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.results) {
          this.countries = response.body.results;
          // this.countries = [
          //   {
          //     id: 1,
          //     created_at: "2025-04-21T12:29:20.268060+03:00",
          //     modified_at: "2025-04-21T12:29:20.268141+03:00",
          //     name: "Kenya",
          //     code: 254,
          //     currency: "KES",
          //     logo: "https://d1laayjhtjigw7.cloudfront.net/logos/kenya.png",
          //     timezone: "Africa/Nairobi",
          //     active: true
          //   },
          //   {
          //     id: 2,
          //     created_at: "2025-04-21T12:29:20.268060+03:00",
          //     modified_at: "2025-04-21T12:29:20.268141+03:00",
          //     name: "United States",
          //     code: 1,
          //     currency: "USD",
          //     logo: "https://flagcdn.com/w320/us.png",
          //     timezone: "America/New_York",
          //     active: true
          //   },
          //   {
          //     id: 3,
          //     created_at: "2025-04-21T12:29:20.268060+03:00",
          //     modified_at: "2025-04-21T12:29:20.268141+03:00",
          //     name: "United Kingdom",
          //     code: 44,
          //     currency: "GBP",
          //     logo: "https://flagcdn.com/w320/gb.png",
          //     timezone: "Europe/London",
          //     active: true
          //   },
          //   {
          //     id: 4,
          //     created_at: "2025-04-21T12:29:20.268060+03:00",
          //     modified_at: "2025-04-21T12:29:20.268141+03:00",
          //     name: "Canada",
          //     code: 1,
          //     currency: "CAD",
          //     logo: "https://flagcdn.com/w320/ca.png",
          //     timezone: "America/Toronto",
          //     active: true
          //   },
          //   {
          //     id: 5,
          //     created_at: "2025-04-21T12:29:20.268060+03:00",
          //     modified_at: "2025-04-21T12:29:20.268141+03:00",
          //     name: "Australia",
          //     code: 61,
          //     currency: "AUD",
          //     logo: "https://flagcdn.com/w320/au.png",
          //     timezone: "Australia/Sydney",
          //     active: true
          //   }
          // ]
        }
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
        // TODO: Display user-friendly error message (e.g., toast notification)
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
        // TODO: Display user-friendly error message
      }
    });
    this.apiSubscriptions.push(subscription);
  }

  updateFormControls(): void {
    // Remove existing controls except 'country'
    Object.keys(this.form.controls).forEach(key => {
      if (key !== 'country') {
        this.form.removeControl(key);
      }
    });

    // Add new controls based on fields
    this.fields.forEach(field => {
      const controlName = field.field_name.toLowerCase().replace(/\s+/g, '_');
      const validators = field.required ? [Validators.required] : [];

      // Add specific validators based on field type
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
    return this.form.get(field.field_name.toLowerCase().replace(/\s+/g, '_')) as FormControl;
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

  onFormSubmit(): void {
    if (this.form.valid) {
      this.onSubmit.emit();
    } else {
      this.form.markAllAsTouched();
    }
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
