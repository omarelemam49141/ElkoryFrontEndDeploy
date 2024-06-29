import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../Models/iuser';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { comparePasswords } from '../../../custom-validators/comparePasswords';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';



@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-admin.component.html',
  styleUrl: './../../customer-account/customer-account.scss'
})
export class AddAdminComponent implements OnInit{
  //edit admin properties
  adminToEditId?: number;
  //form properties
  registerForm!: FormGroup;
  //Notification properties
  snackBarDurationInSeconds = 5;
  //subscription properties
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
              private adminService: AdminService,
              private snackBar: MatSnackBar,
              private router: Router,
              private activatedRoute: ActivatedRoute
  ) {
    this.registerForm = fb.group({
      fName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone: ["", [Validators.required, Validators.pattern("^(010|011|012|015)\\d{8}$")]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      confirmPassword: ["", [Validators.required]],
      governorate: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      city: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      street: ["", [Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      postalCode: ["", [Validators.required,Validators.minLength(2), Validators.maxLength(50)]]
    }, {validators: comparePasswords("signup")})
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.adminToEditId = Number(params.get("id"));
      if (this.adminToEditId) {
        // this.removePasswordRequiredValidation();
        this.getAdminInfoAndPopulateForm(this.adminToEditId);
      }
    })
  }

  //observers
  registerObserver = {
    next: () => {
      if (this.adminToEditId) {
        this.showNotification("تم تعديل الحساب بنجاح", true);
        this.getAdminInfoAndPopulateForm(this.adminToEditId);
      } else {
        this.showNotification("تم انشاء الحساب بنجاح", true);
        this.router.navigate(["/admin-user-management/view-admins"])
      }
    },
    error: (err:Error)=> {
      console.log(err)
      this.showNotification("حدث خطأ", false);
    }
  }

  adminInfoObserver = {
    next: (data: IUser) => {
      this.registerForm.patchValue(data);
    },
    error: (err:Error)=> {
      this.showNotification("حدث خطأ", false);
    }
  }

  //methods
  showNotification(message: string, success: boolean) {
    if (success) {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: message,
        duration: this.snackBarDurationInSeconds * 1000
      });
    } else {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: message,
        duration: this.snackBarDurationInSeconds * 1000
      });
    }
  }
  getAdminInfoAndPopulateForm(adminId: number) {
    this.adminService.getAdminById(adminId).subscribe(this.adminInfoObserver);
  }

  // removePasswordRequiredValidation() {
  //   this.registerForm.get("password")?.clearValidators();
  //   this.registerForm.get("password")?.updateValueAndValidity();
  //   this.registerForm.get("confirmPassword")?.clearValidators();
  //   this.registerForm.get("confirmPassword")?.updateValueAndValidity();
  // }

  register(): void {
    let registerModel: IUser = this.registerForm.value as IUser;
    registerModel.role = 0;
    if (this.adminToEditId) {
      this.UpdateAdmin(registerModel);
    } else {
      this.addNewAdmin(registerModel);
    }
  }

  UpdateAdmin(registerModel: IUser) {
    registerModel.userId = this.adminToEditId;
    this.subscriptions.push(this.adminService.updateAdmin(this.adminToEditId!, registerModel).subscribe(this.registerObserver))
  }

  addNewAdmin(registerModel: IUser) {
    this.subscriptions.push(this.adminService.AddAdmin(registerModel).subscribe(this.registerObserver))
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

  get governorate() {
    return this.registerForm.get("governorate");
  }

  get city() {
    return this.registerForm.get("city");
  }

  get street() {
    return this.registerForm.get("street");
  }

  get postalCode() {
    return this.registerForm.get("postalCode");
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
}
