import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { comparePasswords } from '../../../custom-validators/comparePasswords';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { IForgetPassword } from '../../../Models/iforget-password';

@Component({
  selector: 'app-forget-password-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password-reset-password.component.html',
  styleUrl: '../customer-account.scss'
})
export class ForgetPasswordResetPasswordComponent {
  //form properties
  ResetPasswordForm!: FormGroup
  //notification properties
  snackBarDurationInSeconds = 5;
  constructor(private accountService: AccountService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.ResetPasswordForm = fb.group({
      email: ["", [Validators.required, Validators.email, Validators.maxLength(50)]],
      code: ["", [Validators.required]],
      newPassword: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      confirmNewPassword: ["", Validators.required]
    }, {validators: comparePasswords("resetPassword")})
  }

  resetPasswordObserver = {
    next: (data:any) => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: 'تم تغيير كلمة المرور بنجاح',
        duration: this.snackBarDurationInSeconds * 1000
      });
      this.router.navigate(["/customer-account/login"])
    },
    error: (err:Error)=> {
      console.log(err)
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تغيير كلمة المرور',
        duration: this.snackBarDurationInSeconds * 1000
      });
    }
  }
  
  resetPassword(): void {
    let forgetPasswordModel: IForgetPassword = this.ResetPasswordForm.value as IForgetPassword;
    this.accountService.resetPasswordForgetPassword(forgetPasswordModel).subscribe(this.resetPasswordObserver)
  }

  get email() {
    return this.ResetPasswordForm.get("email");
  }
  get code() {
    return this.ResetPasswordForm.get("code");
  }
  get newPassword() {
    return this.ResetPasswordForm.get("newPassword");
  }
  get confirmPassword() {
    return this.ResetPasswordForm.get("confirmNewPassword");
  }
}
