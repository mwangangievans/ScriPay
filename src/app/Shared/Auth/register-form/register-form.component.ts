import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextInputComponent } from '../../Custom/text-input/text-input.component';
import { PasswordInputComponent } from '../../Custom/password-input/password-input.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, TextInputComponent, PasswordInputComponent],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  
  registerForm: FormGroup;

  constructor() {
    this.registerForm = new FormGroup(
      {
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required])
      }
    );
  }

  getControl(controlName: string): FormControl {
    return this.registerForm.get(controlName) as FormControl;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      
      console.log(this.registerForm.value);
      debugger
    }
  }
}
