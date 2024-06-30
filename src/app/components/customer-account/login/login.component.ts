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
import { ICart } from '../../../Models/icart';
import { CartService } from '../../../services/cart.service';

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


  //cart properties
  loggedusercart: any 

  constructor(private accountService: AccountService,
    private cartService: CartService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
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
      //#region 
     this.getloggedusercart();
     
      //#endregion
      this.router.navigate(["/customer-account/view-profile"])




     

   
     
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تسجيل الدخول',
        duration: this.snackBarDurationInSeconds * 1000
      });
    }
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


 
    getthecartfromlocalstorage() {
      let cart = localStorage.getItem("cart");
      if (cart) {
        return JSON.parse(cart);
      }
      return null;
    }

    getloggedusercart() {
      let userId = this.accountService.getTokenId();
      if (userId) {
      this.cartService.displayCart(userId).subscribe({
        next: (cart) => {
          this.loggedusercart=cart;
this.mergtheoldcartwiththelocalstoragecart(cart);          
        },
        error: (err: Error) => {
          this.snackBar.openFromComponent(FailedSnackbarComponent, {
            data: 'تعذر جلب السلة',
            duration: this.snackBarDurationInSeconds * 1000
          });
        }
      })

      }
    }
mergtheoldcartwiththelocalstoragecart(cart:any) {
console.log("the cart from the server",cart);
let localstoragecart = this.getthecartfromlocalstorage();

console.log("the cart from the local storage",localstoragecart);  

if (localstoragecart==null||localstoragecart.productsAmounts.length<1)  {
        //if the local storage cart is empty set the cart from the server
        console.log("the local storage cart is empty");
        localStorage.setItem("cart", JSON.stringify(cart));
}


  }
}
