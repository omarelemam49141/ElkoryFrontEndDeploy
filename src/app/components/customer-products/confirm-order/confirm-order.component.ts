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
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "قم بإعادة تسجيل الدخول مرة أخرى",
        duration: this.notificationDurationInSeconds * 1000
      })
      this.router.navigate(["/customer-account/login"])
    } else {
      this.cartService.getOrderInfo(tokenId).subscribe(this.reviewOrderObserver)
    }
    
  }
  //observers
  reviewOrderObserver = {
    next: (data: IReviewOrder) => {
      this.reviewOrderModel = data
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "تعذر تحميل الطلب!",
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  //methods
  getUserId() {
    return this.accountService.getTokenId();
  }

  confirmOrder() {
    this.dialog.open(SendOrderComponent, {
      
    })
  }
}
