// services/form.service.ts
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private fb: FormBuilder) { }

  createMerchantInfoForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      location: ['', Validators.required],
      logo: [null]
    });
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

  createkycInfoForm(): FormGroup {
    return this.fb.group({
      country: ['', Validators.required],

    });
  }

  createBankInfoForm(): FormGroup {
    return this.fb.group({
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
      branchCode: ['', Validators.required],
      currency: ['', Validators.required],
      swiftCode: ['']
    });
  }

  createAuthForm(): FormGroup {
    return this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }
}
