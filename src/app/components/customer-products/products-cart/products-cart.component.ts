import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICart } from '../../../Models/icart';
import { CartService } from '../../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';

@Component({
  selector: 'app-products-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private snackBar: MatSnackBar
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
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: " تم حذف العربة بنجاح!",
        duration: this.notificationDurationInSeconds * 1000
      })
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
    if (localStorage.getItem("cart")) {
      this.cart = JSON.parse(localStorage.getItem("cart")!);
    } else {
      this.subscriptions.push(this.cartService.displayCart().subscribe(this.getCartObserver))
    }
  }

  updateLocalStorageWithCart() {
    this.cartChanged = true;
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  decreaseCartPrice(productId: number): void {
    this.cart.finalPrice -= this.cart.productsAmounts.find(p => p.productId == productId)!.finalPrice;
  }

  increaseCartPrice(productId: number): void {
    this.cart.finalPrice += this.cart.productsAmounts.find(p => p.productId == productId)!.finalPrice;
  }

  clearCart(): void {
    localStorage.removeItem("cart");
    this.cart = {} as ICart;
    this.subscriptions.push(this.cartService.deleteCart().subscribe(this.deleteCartObserver));
  }

  updateCart(): void {
    this.cartService.updateCart(this.cart).subscribe(this.updateCartObserver);
  }

  deleteProductFromCart(productId: number): void {
    this.cart.productsAmounts = this.cart.productsAmounts.filter(p => p.productId != productId);
    this.updateLocalStorageWithCart();
  }

  ngOnDestroy(): void {
    if (this.cartChanged) {
      this.updateCart();
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
