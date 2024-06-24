import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: '../customer-account.scss'
})
export class ForgetPasswordComponent {
  //form properties
  forgetPasswordForm!: FormGroup;

  //notification properties
  notificationDurationInSeconds = 5;
  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email, Validators.maxLength(50)]]
    })
  }

  sendEmail(): void {
    if (this.forgetPasswordForm.valid) {
      this.accountService.forgetPasswordGettingCode(this.email?.value).subscribe({
        next: () => {
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: "تم ارسال رمز التحقق",
            duration: this.notificationDurationInSeconds * 1000
          })
          this.router.navigate(["/customer-account/forget-password-reset-password"])
        },
        error: () => {
          this.snackBar.openFromComponent(FailedSnackbarComponent, {
            data: "تعذر ارسال رمز التحقق",
            duration: this.notificationDurationInSeconds * 1000
          })
        }
      })
    }
  }

  get email() {
    return this.forgetPasswordForm.get("email");
  }
}
