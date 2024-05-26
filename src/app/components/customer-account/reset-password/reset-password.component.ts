import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { comparePasswords } from '../../../custom-validators/comparePasswords';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { IResetPassword } from '../../../Models/ireset-password';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
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
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
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
      this.router.navigate(["/customer-account/view-profile"])
    },
    error: (err:Error)=> {
      console.log(err)
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تغيير كلمة المرور',
        duration: this.snackBarDurationInSeconds * 1000
      });
    }
  }
  
  login(): void {
    let resetPasswordModel: IResetPassword = this.ResetPasswordForm.value as IResetPassword;
    this.accountService.resetPassword(resetPasswordModel).subscribe(this.resetPasswordObserver)
  }
  
  get email() {
    return this.ResetPasswordForm.get("email");
  }
  get password() {
    return this.ResetPasswordForm.get("password");
  }
  get newPassword() {
    return this.ResetPasswordForm.get("newPassword");
  }
  get confirmPassword() {
    return this.ResetPasswordForm.get("confirmNewPassword");
  }
}