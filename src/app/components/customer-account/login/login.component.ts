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

      //   if ((localstoragecart==null||localstoragecart.productsAmounts.length<1)&&cart.productsAmounts.length>0)  {
      //   //if the local storage cart is empty set the cart from the server
      //   console.log("the local storage cart is empty");
      //   localStorage.setItem("cart", JSON.stringify(cart));
      //   this.cartService.changeNumberOfItemsInCart(cart.numberOfUniqueProducts);

      //   return;
      // }
      console.log("the length of cart from database",cart.length);

        if ( cart.length==0&&localstoragecart && localstoragecart.productsAmounts.length > 0) {
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
    return;
  }

  else{
    //covert the two carts to Icart objects
    console.log("converting the two carts to Icart objects");
    let cartObject: ICart = {
      userId: this.accountService.getTokenId(),
      productsAmounts: cart.productsAmounts,
      finalPrice: cart.finalPrice,
      numberOfUniqueProducts: cart.numberOfUniqueProducts,
      numberOfProducts: cart.numberOfProducts
    }
    let localstoragecartObject: ICart = {
      userId: this.accountService.getTokenId(),
      productsAmounts: localstoragecart.productsAmounts,
      finalPrice: localstoragecart.finalPrice,
      numberOfUniqueProducts: localstoragecart.numberOfUniqueProducts,
      numberOfProducts: localstoragecart.numberOfProducts
    }

    //merge the two carts
    console.log("merging the two carts");
  let productsIncartfromlocalstorage = localstoragecartObject.productsAmounts;
  let productsIncartfromserver = cartObject.productsAmounts;



  if(productsIncartfromserver.length>productsIncartfromlocalstorage.length){


  productsIncartfromserver.forEach(productfromserver => {

    productsIncartfromlocalstorage.forEach(productfromlocalstorage => {
      if (productfromlocalstorage.productId == productfromserver.productId) {
        this.productService.getById(productfromserver.productId).subscribe({
          next: (product) => {
            if(product.amount<(productfromserver.amount+productfromlocalstorage.amount)){
              productfromserver.amount = product.amount;
              cartObject.numberOfProducts+=product.amount-productfromlocalstorage.amount;
              cartObject.finalPrice+=product.amount*productfromserver.finalPrice-productfromlocalstorage.amount*productfromserver.finalPrice;

            }
            else {
              productfromserver.amount += productfromlocalstorage.amount;
              cartObject.numberOfProducts+=productfromlocalstorage.amount;
              cartObject.finalPrice+=productfromlocalstorage.amount*productfromserver.finalPrice;
            }
          }
        })
        
       
      }
      else{
        let projectisaddbefore=productsIncartfromserver.findIndex(product => product.productId == productfromlocalstorage.productId)
        if(projectisaddbefore==-1){
        productsIncartfromserver.push(productfromlocalstorage);
        cartObject.numberOfUniqueProducts++;
        cartObject.numberOfProducts+=productfromlocalstorage.amount;
        cartObject.finalPrice+=productfromlocalstorage.amount*productfromlocalstorage.finalPrice;
        }


      }

    })


  }
  )
  console.log("the cart object",cartObject);
this.cartService.updateCart(cartObject).subscribe({
  next: (data) => {
    console.log("the data",data);
    localStorage.removeItem("cart");
    this.cartService.changeNumberOfItemsInCart(cartObject.numberOfUniqueProducts);






  }
})
  }




}
}
}