import { Component, OnInit, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MerchantsInfoComponent } from '../merchants-info/merchants-info.component';
import { KycInfoComponent } from '../kyc-info/kyc-info.component';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface OnboardingState {
  currentStep: number;
  completedSteps: number[];
  selectedLogo: { name: string } | null;
  stepValidity: { [key: number]: boolean };
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
      title: 'Onboarding Status',
      description: 'Check your Onboarding Status',
      icon: 'CreditCard',
      color: 'from-orange-500 to-red-500'
    },
  ];

  state: OnboardingState = {
    currentStep: 1,
    completedSteps: [],
    selectedLogo: null,
    stepValidity: {}
  };

  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.loadSavedState();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get progressPercentage(): number {
    return (this.state.completedSteps.length / this.steps.length) * 100;
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

  private loadSavedState() {
    const savedState = localStorage.getItem('onboardingState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.state = {
          currentStep: state.currentStep || 1,
          completedSteps: state.completedSteps || [],
          selectedLogo: state.selectedLogo || null,
          stepValidity: state.stepValidity || {}
        };
      } catch (e) {
        console.error('Error parsing saved state', e);
      }
    }
  }

  private saveCurrentState() {
    localStorage.setItem('onboardingState', JSON.stringify(this.state));
  }

  updateState(newState: Partial<OnboardingState>) {
    this.state = { ...this.state, ...newState };
    this.saveCurrentState();
  }
}
