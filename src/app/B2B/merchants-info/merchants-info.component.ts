
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalstorageService } from '../../service/localstorage.service';
import { OnboardingService } from '../../service/onboarding.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../../service/http.service';
import { Merchant, Pagination } from '../B2B.interface';
import { UserObject } from '../../Shared/Auth/user.interface';

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
  selectedLogo: File | null = null;
  currentStep: number = 1;
  isLoading: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private subscription: Subscription = new Subscription();
  private apiSubscriptions: Subscription[] = [];
  Merchants: Merchant[] = [];
  userObject!: UserObject



  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalstorageService,
    private onboardingService: OnboardingService,
    private httpService: HttpService

  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      location: ['', Validators.required],
      logo: [null]
    });
  }

  ngOnInit() {
    this.loadFormData();
    // console.log("hello....");

    // this.getMerchants();

    this.subscription.add(
      this.onboardingService.state$.subscribe(state => {
        this.currentStep = state.currentStep;
        this.selectedLogo = state.selectedLogo ? new File([], state.selectedLogo.name) : null;
      })
    );
    this.subscription.add(
      this.onboardingService.isLoading$.subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );
    // this.form.statusChanges.subscribe(status => {
    //   this.localStorageService.set('merchantInfoFormData', JSON.stringify(this.form.value));
    //   this.onboardingService.setStepValidity(1, status === 'VALID');
    // });
    // this.onboardingService.setStepValidity(1, this.form.valid);
  }

  // getMerchants(): void {
  //   const url = 'onboarding/merchants';
  //   const subscription = this.httpService.get<Pagination<Merchant>>(url).subscribe({
  //     next: (response) => {
  //       if (response.status === 200 && response.body?.results) {
  //         this.Merchants = response.body.results;
  //         this.updatemachartForm()

  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching countries:', error);
  //     }
  //   });
  //   this.apiSubscriptions.push(subscription);
  // }
  updatemachartForm(user: UserObject) {
    if (user.is_merchant && !user.merchant.active) {
      this.form.patchValue(
        {
          name: user.merchant.name,
          email: user.merchant.email,
          address: user.merchant.address,
          location: user.merchant.location,
          logo: user.merchant.logo,
        });
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadFormData() {
    this.userObject = this.localStorageService.get('userObject');

    if (this.userObject) {
      try {
        this.updatemachartForm(this.userObject)
        // this.form.patchValue(JSON.parse(savedData));
      } catch (e) {
        console.error('Error parsing saved merchant info form data', e);
      }
    }
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.selectedLogo = file;
      this.form.patchValue({ logo: file });
      this.onboardingService.handleFileUpload(file);
    }
  }

  async onFormSubmit() {
    // debugger
    if (this.form.valid) {
      this.onboardingService.setStepValidity(1, true);

      // Create FormData object
      const formData = new FormData();
      // Append form values to FormData
      Object.keys(this.form.value).forEach(key => {
        formData.append(key, this.form.value[key]);
      });

      // this.subscription = this.httpService
      //   .post<Merchant>('onboarding/merchants', formData, {
      //     showSuccessNotification: true,
      //     skipAuth: false
      //   })
      //   .subscribe({
      //     next: (res: any) => {
      //     },
      //     error: (err: any) => {
      //       console.log(err);


      //       debugger

      //     }
      //   });

      // this.form.markAllAsTouched();




      const success = await this.onboardingService.submitStep(1, formData, this.userObject);
      if (!success) {
        console.log({ success });

        console.error('Merchant info submission failed');
      }
      else {
        this.form.markAllAsTouched();
      }


    }
  }

  goToPreviousStep() {
    this.onboardingService.goToPreviousStep();
  }
}

