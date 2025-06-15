
import { Component, OnInit, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OnboardingService } from '../../service/onboarding.service';
import { MerchantsInfoComponent } from '../merchants-info/merchants-info.component';
import { KycInfoComponent } from '../kyc-info/kyc-info.component';
// import { BankInfoComponent } from '../bank-info/bank-info.component';
// import { VerificationComponent } from '../verification/verification.component';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MerchantsInfoComponent,
    KycInfoComponent,
    // BankInfoComponent,
    // VerificationComponent
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
export class OnboardingComponent implements OnInit, OnDestroy {
  steps: Step[] = [];
  state: { currentStep: number; completedSteps: number[]; selectedLogo: { name: string } | null; stepValidity: { [key: number]: boolean } } = {
    currentStep: 1,
    completedSteps: [],
    selectedLogo: null,
    stepValidity: {}
  };
  private subscription: Subscription = new Subscription();

  constructor(private onboardingService: OnboardingService) { }

  ngOnInit() {
    this.steps = this.onboardingService.getSteps();
    this.subscription.add(
      this.onboardingService.state$.subscribe(state => {
        this.state = state;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get progressPercentage(): number {
    return this.onboardingService.getProgressPercentage();
  }

  getStepClasses(step: Step): { [key: string]: boolean } {
    return {
      'bg-green-500 border-green-500 text-white': this.state.completedSteps.includes(step.id),
      'bg-gradient-to-r text-white shadow-lg': this.state.currentStep === step.id,
      'border-transparent': this.state.currentStep === step.id,
      'bg-white border-gray-300 text-gray-400': !this.state.completedSteps.includes(step.id) && this.state.currentStep !== step.id,
      [step.color]: this.state.currentStep === step.id
    };
  }
}

