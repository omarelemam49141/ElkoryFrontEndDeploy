import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { ILoginModel } from '../../../Models/ilogin-model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { CartService } from '../../../services/cart.service';
import { ICart } from '../../../Models/icart';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: '../customer-account.scss'
})
export class LoginComponent {
  //form properties
  loginForm!: FormGroup
  //notification properties
  snackBarDurationInSeconds = 5;
  constructor(private accountService: AccountService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private cartService: CartService
  ) {
    this.loginForm = fb.group({
      email: ["", [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ["", [Validators.required, Validators.maxLength(50)]]
    })
  }

  loginObserver = {
    next: (response: HttpResponse<any>) => {
      const token = response.headers.get('bearer-token'); // Adjust header name as necessary
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: 'تم تسجيل الدخول بنجاح',
        duration: this.snackBarDurationInSeconds * 100
      });
      localStorage.setItem("token", "Bearer " + token);
      this.accountService.isLoggedIn = true;
      this.accountService.activateLogin();
      this.getUserCartFromDatabaseIfExist();
      this.router.navigate(["/customer-account/view-profile"])
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تسجيل الدخول',
        duration: this.snackBarDurationInSeconds * 1000
      });
    }
  }

  updateCartObserver = {
    next: ()=> {
      this.showNotifications("تم تحديث بيانات العربة", true);
    },
    error: (err: Error) => {
      this.showNotifications("تعذر تحديث بيانات العربة", false);
    }
  }

  //methods
  showNotifications(message: string, success: boolean) {
    if (success) {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: message,
        duration: this.snackBarDurationInSeconds * 1000
      })
    } else {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: message,
        duration: this.snackBarDurationInSeconds * 1000
      })
    }
  }
  addCartToDatabaseAndSaveItInLocalStorage(cart: ICart) {
    this.cartService.updateCart(cart).subscribe(this.updateCartObserver);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  getUserCartFromDatabaseIfExist() {
    let userId = this.accountService.getTokenId();
    this.cartService.displayCart(userId).subscribe((cart) => {
      if(cart.numberOfUniqueProducts > 0) { //user already has cart in the database, then save it in the local storage
        localStorage.setItem("cart", JSON.stringify(cart));
      } else if (localStorage.getItem("cart")) { //user doesn't have cart in the database, but he had a cart as an anonymous user
        let cart: ICart = JSON.parse(localStorage.getItem("cart")!) as ICart
        cart.userId = userId;
        this.addCartToDatabaseAndSaveItInLocalStorage(cart);
      }
    })
  }

  login(): void {
      let loginModel: ILoginModel = this.loginForm.value as ILoginModel;
      this.accountService.login(loginModel).subscribe(this.loginObserver)
    }

  get email() {
      return this.loginForm.get("email");
    }
  get password() {
      return this.loginForm.get("password");
    }
  }
