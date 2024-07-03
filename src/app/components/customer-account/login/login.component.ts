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
import { ProductService } from '../../../services/product.service';
import { AdminNotificationsService } from '../../../services/admin-notifications.service';
import { IProduct } from '../../../Models/iproduct';

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
    private productService: ProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private adminNotificationsService: AdminNotificationsService
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
      
      this.saveToken(JSON.stringify(token));
      this.navigateToMainPage();
      if(this.accountService.getTokenRole().toLowerCase() == "admin") {
        this.getUpdatedOrdersStats();
      }
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تسجيل الدخول',
        duration: this.snackBarDurationInSeconds * 1000
      });
    }
  }

  //methods
  saveToken(token: string) {
    localStorage.setItem("token", "Bearer " + token);
    this.accountService.isLoggedIn = true;
    this.accountService.activateLogin();
  }
  getUpdatedOrdersStats() {
    this.adminNotificationsService.getNumberOfPendingOrders();
  }
  navigateToMainPage() {
    if(this.accountService.getTokenRole().toLowerCase() == "customer") {
      this.getloggedusercart();
      this.router.navigate(["/customer-products/products-list"])
    } else if (this.accountService.getTokenRole().toLowerCase() == "admin") {
      this.router.navigate(["/admin-products/admin-products-list"])
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

// If the server cart is empty, update the server cart with the local storage cart
        if ( cart.length==0&&localstoragecart && localstoragecart.productsAmounts.length > 0) 
          {
    console.log("the server cart is empty, updating server cart with local storage cart");
    let cartObject: ICart = {
      userId: this.accountService.getTokenId(),
      productsAmounts: localstoragecart.productsAmounts,
      finalPrice:localstoragecart.finalPrice,
      numberOfUniqueProducts: localstoragecart.numberOfUniqueProducts,
      numberOfProducts: localstoragecart.numberOfProducts


      
    }
    
    this.cartService.updateCart(cartObject).subscribe({
      next: (data) => {
        console.log("the data",data);
        localStorage.removeItem("cart");
        this.cartService.changeNumberOfItemsInCart(cartObject.numberOfUniqueProducts);
      }
    })

    return;
  }

  // If the local storage cart is empty, set the cart from the server
  else if ((localstoragecart == null || localstoragecart.productsAmounts.length < 1) && cart.productsAmounts.length > 0) {
    console.log("the local storage cart is empty");
    localStorage.setItem("cart", JSON.stringify(cart));
    this.cartService.changeNumberOfItemsInCart(cart.numberOfUniqueProducts)
    return;
  }



else{
  cart.productsAmounts.forEach((productfromserver:any) => {
  console.log("the product from the server",productfromserver);
  let locationOfProductInLocalCart=localstoragecart.productsAmounts.findIndex((p:any)=>p.productId==productfromserver.productId)
  if(locationOfProductInLocalCart==-1){
  localstoragecart.productsAmounts.push(productfromserver);
  localstoragecart.numberOfUniqueProducts++;
  localstoragecart.numberOfProducts+=productfromserver.amount;
  localstoragecart.finalPrice+=productfromserver.amount*productfromserver.finalPrice;
  }
  else{
    
    let productFromLocalCart=localstoragecart.productsAmounts[locationOfProductInLocalCart];
    productFromLocalCart.amount+=productfromserver.amount;
    localstoragecart.numberOfProducts+=productfromserver.amount;
    localstoragecart.finalPrice+=productfromserver.amount*productfromserver.finalPrice; 

  }

})
localStorage.setItem("cart", JSON.stringify(localstoragecart));
this.cartService.changeNumberOfItemsInCart(localstoragecart.numberOfUniqueProducts);
this.cartService.updateCart(localstoragecart).subscribe({
  next: (data) => {
    console.log("the data",data);
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(localstoragecart));
    this.cartService.changeNumberOfItemsInCart(localstoragecart.numberOfUniqueProducts);

  }})

}

}
}