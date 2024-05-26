import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { comparePasswords } from '../../../custom-validators/comparePasswords';
import { AccountService } from '../../../services/account.service';
import { ISignUpModel } from '../../../Models/isign-up-model';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnDestroy{
  //form properties
  registerForm!: FormGroup;
  //Notification properties
  snackBarDurationInSeconds = 5;
  //subscription properties
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private snackBar: MatSnackBar,
              private router: Router
  ) {
    this.registerForm = fb.group({
      fName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone: ["", [Validators.required, Validators.pattern("^(010|011|012|015)\\d{8}$")]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      confirmPassword: ["", [Validators.required]]
    }, {validators: comparePasswords("signup")})
  }

  registerObserver = {
    next: (data: string) => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: 'تم انشاء الحساب بنجاح',
        duration: this.snackBarDurationInSeconds * 1000
      });
      localStorage.setItem("token", "Bearer " + data);
      this.accountService.isLoggedIn = true;
      this.router.navigate(["/customer-account/view-profile"])
    },
    error: (err:Error)=> {
      console.log(err)
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر انشاء الحساب',
        duration: this.snackBarDurationInSeconds * 1000
      });
    }
  }

  register(): void {
    let registerModel: ISignUpModel = this.registerForm.value as ISignUpModel;
    this.subscriptions.push(this.accountService.signUp(registerModel).subscribe(this.registerObserver))
  }

  get fName() {
    return this.registerForm.get("fName");
  }

  get lName() {
    return this.registerForm.get("lName");
  }

  get email() {
    return this.registerForm.get("email");
  }

  get phone() {
    return this.registerForm.get("phone");
  }

  get password() {
    return this.registerForm.get("password");
  }

  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
}