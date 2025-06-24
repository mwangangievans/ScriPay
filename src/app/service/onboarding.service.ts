import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalstorageService } from '../service/localstorage.service';

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
  private state: OnboardingState = {
    currentStep: 1,
    completedSteps: [],
    selectedLogo: null,
    stepValidity: {}
  };

  private stateSubject = new BehaviorSubject<OnboardingState>(this.state);
  state$: Observable<OnboardingState> = this.stateSubject.asObservable();

  constructor(private localStorageService: LocalstorageService) {
    this.loadSavedState();
  }

  setStepValidity(step: number, isValid: boolean) {
    this.state.stepValidity[step] = isValid;
    this.updateState();
  }

  completeStep(step: number) {
    if (!this.state.completedSteps.includes(step)) {
      this.state.completedSteps = [...this.state.completedSteps, step];
    }
    if (this.state.currentStep < 3) { // Assuming 3 steps based on the provided steps
      this.state.currentStep++;
    }
    this.updateState();
    console.log('[OnboardingService] completeStep called, state:', this.state); // DEBUG LOG
    this.stateSubject.next({ ...this.state }); // Notify subscribers for global UI update
  }

  goToPreviousStep() {
    if (this.state.currentStep > 1) {
      this.state.currentStep--;
      this.updateState();
    }
  }

  setSelectedLogo(logo: { name: string } | null) {
    this.state.selectedLogo = logo;
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
        console.error('Error parsing saved state', e);
      }
    }
  }

  private updateState() {
    this.localStorageService.set('onboardingState', JSON.stringify(this.state));
    this.stateSubject.next({ ...this.state });
    console.log('[OnboardingService] updateState called, state:', this.state); // DEBUG LOG
  }
}
