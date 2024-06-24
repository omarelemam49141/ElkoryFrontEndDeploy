import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { IEditProfile } from '../../../Models/iedit-profile';
import * as jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit, OnDestroy {
  profileInfo!: IEditProfile;
  //form properties
  editProfileForm!: FormGroup;
  //Notification properties
  snackBarDurationInSeconds = 5;
  //subscription properties
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.editProfileForm = this.fb.group({
      fName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone: ["", [Validators.required, Validators.pattern("^(010|011|012|015)\\d{8}$")]],
      governorate: ["", [Validators.minLength(2), Validators.maxLength(50)]],
      city: ["", [Validators.minLength(2), Validators.maxLength(50)]],
      street: ["", [Validators.minLength(2), Validators.maxLength(50)]],
      postalCode: [""]
    });
  }

  ngOnInit(): void {
    this.accountService.viewProfile().subscribe({
      next: (data: IEditProfile) => {
        this.profileInfo = data
        this.editProfileForm.patchValue(this.profileInfo);
      },
      error: (err: Error) => {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: "تعذر تحميل ييانات الحساب",
          duration: this.snackBarDurationInSeconds * 1000
        })
      }
    });
  }

  editProfileObserver = {
    next: (data: any) => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: 'تم تعديل معلومات الحساب بنجاح',
        duration: this.snackBarDurationInSeconds * 1000
      });
      this.router.navigate(["/customer-account/view-profile"])
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تعديل معلومات الحساب',
        duration: this.snackBarDurationInSeconds * 1000
      });
    }
  }

  updateProfile(): void {
    let editProfileModel: IEditProfile = this.editProfileForm.value as IEditProfile;
    this.subscriptions.push(this.accountService.editProfile(editProfileModel).subscribe(this.editProfileObserver))
  }

  get fName() {
    return this.editProfileForm.get("fName");
  }

  get lName() {
    return this.editProfileForm.get("lName");
  }

  get email() {
    return this.editProfileForm.get("email");
  }

  get phone() {
    return this.editProfileForm.get("phone");
  }

  get governorate() {
    return this.editProfileForm.get("governorate");
  }

  get city() {
    return this.editProfileForm.get("city");
  }

  get street() {
    return this.editProfileForm.get("street");
  }

  get postalCode() {
    return this.editProfileForm.get("postalCode");
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
