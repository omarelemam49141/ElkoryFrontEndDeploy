import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICart } from '../../../Models/icart';
import { CartService } from '../../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Token } from '@angular/compiler';
import { IProduct } from '../../../Models/iproduct';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendOrderComponent } from '../send-order/send-order.component';

@Component({
  selector: 'app-products-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products-cart.component.html',
  styleUrl: './products-cart.component.scss'
})
export class ProductsCartComponent implements OnDestroy, OnInit{
  cart!: ICart;
  cartChanged = false;

  //notifications
  notificationDurationInSeconds = 5;

  //subscriptions
  subscriptions: Subscription[] = [];

  constructor(private cartService: CartService,
    private snackBar: MatSnackBar,
    private accountService: AccountService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  //observers
  getCartObserver = {
    next: (data: ICart) => {
      localStorage.setItem("cart", JSON.stringify(data));
      this.cart = data
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "تعذر تحميل العربة!",
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  deleteCartObserver = {
    next: (data: ICart) => {
      this.loadCart();
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "تعذر حذف العربة!",
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  updateCartObserver = {
    next: (data: ICart) => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: " تم تعديل العربة بنجاح!",
        duration: this.notificationDurationInSeconds * 1000
      })
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "تعذر تعديل العربة!",
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }
  //end observers
  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (localStorage.getItem("cart")) {
      this.cart = JSON.parse(localStorage.getItem("cart")!);
    } else {
      let token = JSON.stringify(localStorage.getItem('token'));
      if (!token) {
        this.router.navigate(['/customer-account/login']);
      } else {
        let userId = this.accountService.getIdFromToken(token);
        this.subscriptions.push(this.cartService.displayCart(userId).subscribe(this.getCartObserver))
      }
    }
  }

  updateLocalStorageWithCart() {
    this.cartChanged = true;
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  decreaseCartPrice(productId: number): void {
    this.cart.finalPrice -= this.cart.productsAmounts.find(p => p.productId == productId)!.finalPrice;
    this.updateLocalStorageWithCart();
  }

  increaseCartPrice(productId: number): void {
    this.cart.finalPrice += this.cart.productsAmounts.find(p => p.productId == productId)!.finalPrice;
    this.updateLocalStorageWithCart();
  }

  validateSelectedPRoductAmount(product: IProduct, productAmount: number): boolean {
    let notValid = false;
    if (productAmount < 1) {
      product.amount = 1;
      notValid = true;
    } else if (productAmount > product.allAmount!) {
      product.amount = product.allAmount!;
      notValid = true;
    } 
    return notValid;
  }

  decreaseOrIncreaseProductAmount(product: IProduct, productAmount: number): void {
    if (productAmount < product.amount) {
      product.amount = productAmount;
      this.decreaseCartPrice(product.productId);
    } else {
      product.amount = productAmount;
      this.increaseCartPrice(product.productId);
    }
  }

  updateProductAmount(product: IProduct, event: any): void {
    if(this.validateSelectedPRoductAmount(product, +event.target.value)){
      return;
    }

    this.decreaseOrIncreaseProductAmount(product, +event.target.value);
  }

  updateProductAmountWithProuctId(product: IProduct, productAmount: any): void {
    if(this.validateSelectedPRoductAmount(product, productAmount.value)){
      return;
    }

    this.decreaseOrIncreaseProductAmount(product, productAmount.value);
  }

  clearCart(): void {
    localStorage.removeItem("cart");
    this.cart = {} as ICart;
    let token = localStorage.getItem('token');
    if (token) {
      let userId = this.accountService.getIdFromToken(token);
      this.subscriptions.push(this.cartService.deleteCart(userId).subscribe(this.deleteCartObserver));
    }
  }

  updateCart(isOrderOpen: boolean = false): void {
    if (isOrderOpen) {
      this.cartService.updateCart(this.cart).subscribe({
        next: (data: ICart) => {
          this.router.navigate(['/customer-products/confirm-order']);
        },
        error: (err: Error) => {
          console.log(err)
          this.snackBar.openFromComponent(FailedSnackbarComponent, {
            data: "تعذر تعديل العربة!",
            duration: this.notificationDurationInSeconds * 1000
          })
        }
      });
    } else {
      this.cartService.updateCart(this.cart).subscribe(this.updateCartObserver);
    }
  }

  deleteProductFromCart(productId: number): void {
    this.cart.productsAmounts = this.cart.productsAmounts.filter(p => p.productId != productId);
    this.updateLocalStorageWithCart();
  }

  openSendOrder() {
    let dialogRef: MatDialogRef<SendOrderComponent> = this.dialog.open(SendOrderComponent, {
    })

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.clearCart();
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: "تم ارسال الطلب بنجاح!",
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    })
  }

  ngOnDestroy(): void {
    if (this.cartChanged) {
      this.updateCart();
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
