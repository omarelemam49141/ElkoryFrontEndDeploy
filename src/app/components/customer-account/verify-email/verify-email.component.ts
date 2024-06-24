import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IVerifyEmail } from '../../../Models/iverify-email';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrl: '../customer-account.scss'
})
export class VerifyEmailComponent {
  //form properties
  verifyEmailForm!: FormGroup;

  //notification properties
  notificationDurationInSeconds = 5;
  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.verifyEmailForm = this.fb.group({
      email: ["", [Validators.required, Validators.email, Validators.maxLength(50)]],
      code: ["", [Validators.required]]
    })
  }

  verifyEmail() {
    let verifyEmailObject: IVerifyEmail = this.verifyEmailForm.value as IVerifyEmail;
    this.accountService.verifyEmail(verifyEmailObject).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: "تم تفعيل الحساب بنجاح",
          duration: this.notificationDurationInSeconds * 1000
        })
        this.router.navigate(["/customer-account/login"]);
      },
      error: (e: Error) => {
        console.log(e);
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: "لم يتم تفعيل الحساب",
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    })
  }

  get email() {
    return this.verifyEmailForm.get("email");
  }

  get code() {
    return this.verifyEmailForm.get("code");
  }
}
