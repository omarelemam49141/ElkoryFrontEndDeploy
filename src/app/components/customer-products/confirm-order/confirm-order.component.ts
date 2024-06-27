import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { IReviewOrder } from '../../../Models/ireview-order';
import { AccountService } from '../../../services/account.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { MatDialog } from '@angular/material/dialog';
import { SendOrderComponent } from '../send-order/send-order.component';
import { FormsModule } from '@angular/forms';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.scss'
})
export class ConfirmOrderComponent implements OnInit {
  reviewOrderModel!: IReviewOrder;

  //notification properties
  notificationDurationInSeconds = 5;
  constructor(private cartService: CartService,
    private accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    let tokenId = this.getUserId();
    if (!tokenId) {
      this.showNotification("يجب عليك تسجيل الدخول اولا", false);
      this.router.navigate(["/customer-account/login"])
    } else {
      this.getUserOrderInfo(tokenId);
    }
    
  }
  //observers
  reviewOrderObserver = {
    next: (data: IReviewOrder) => {
      console.log("order details is: " + data)
      this.reviewOrderModel = data
    },
    error: (err: Error) => {
      console.log(err)
      this.showNotification("تعذر تحميل الطلب. الرجاء المحاولة مرة أخرى", false);
    }
  }

  //methods
  getUserOrderInfo(userId: number) {
    this.cartService.getOrderInfo(userId).subscribe(this.reviewOrderObserver)
  }
  showNotification(message: string, success: boolean) {
    if (success) {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: message,
        duration: this.notificationDurationInSeconds * 1000
      })
    } else {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: message,
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }
  getUserId() {
    return this.accountService.getTokenId();
  }

  confirmOrder() {
    this.dialog.open(SendOrderComponent, {
      
    })
  }
}
