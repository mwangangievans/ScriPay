import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalstorageService } from '../service/localstorage.service';
import { HttpService } from '../service/http.service';
import { UserObject } from '../Shared/Auth/user.interface';

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

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private steps: Step[] = [
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
      description: 'Submmit kyc documents',
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
    // {
    //   id: 4,
    //   title: 'Verification',
    //   description: 'Secure your verification details',
    //   icon: 'Shield',
    //   color: 'from-cyan-500 to-blue-600'
    // }
  ];

  private state: OnboardingState = {
    currentStep: 1,
    completedSteps: [],
    selectedLogo: null,
    stepValidity: {}
  };

  private stateSubject = new BehaviorSubject<OnboardingState>(this.state);
  state$: Observable<OnboardingState> = this.stateSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(
    private localStorageService: LocalstorageService,
    private httpService: HttpService
  ) {
    this.loadSavedState();
  }

  getSteps(): Step[] {
    return this.steps;
  }

  getCurrentState(): OnboardingState {
    return this.state;
  }

  setStepValidity(step: number, isValid: boolean) {
    this.state.stepValidity[step] = isValid;
    this.updateState();
  }

  async submitStep(step: number, kycData?: any, userObject?: UserObject, isSingleSubmit?: boolean): Promise<boolean> {

    if (!isSingleSubmit) {
      if (!this.state.stepValidity[step]) {
        return false;
      }
    }

    this.isLoadingSubject.next(true);
    try {
      if (step === 1 && kycData && !userObject?.is_merchant) {
        const response = await this.httpService.post('onboarding/merchants', kycData).toPromise();
        if (response?.status !== 200) {
          return false;
        }
      }
      if (step === 2 && kycData) {
        console.log({ kycData });

        const response = await this.httpService.post('onboarding/kycs', kycData).toPromise();
        if (response?.status !== 200) {
          return false;
        }
      }

      if (!this.state.completedSteps.includes(step)) {
        this.state.completedSteps = [...this.state.completedSteps, step];
      }
      if (this.state.currentStep < this.steps.length) {
        this.state.currentStep++;
      }
      this.saveCurrentState();
      this.updateState();
      return true;
    } catch (error) {
      return false;
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  goToPreviousStep() {
    if (this.state.currentStep > 1) {
      this.state.currentStep--;
      this.saveCurrentState();
      this.updateState();
    }
  }

  handleFileUpload(file: File | null) {
    this.state.selectedLogo = file ? { name: file.name } : null;
    this.saveCurrentState();
    this.updateState();
  }

  private loadSavedState() {
    const savedState = this.localStorageService.get('onboardingState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.state = {
          currentStep: state.currentStep || 1,
          completedSteps: state.completedSteps || [],
          selectedLogo: state.selectedLogo || null,
          stepValidity: state.stepValidity || {}
        };
        this.updateState();
      } catch (e) {
      }
    }
  }

  private saveCurrentState() {
    this.localStorageService.set('onboardingState', JSON.stringify(this.state));
  }

  private updateState() {
    this.stateSubject.next({ ...this.state });
  }

  getProgressPercentage(): number {
    return (this.state.completedSteps.length / this.steps.length) * 100;
  }
}

