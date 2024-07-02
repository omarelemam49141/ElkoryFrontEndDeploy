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
import { IOffer } from '../../../Models/ioffer';
import { OfferDetailsComponent } from '../../admin-offers/offer-details/offer-details.component';
import { OrderService } from '../../../services/order.service';
import { IOrderModifiedPrice } from '../../../Models/iorder-modified-price';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';
import { AdminNotificationsService } from '../../../services/admin-notifications.service';

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, OfferDetailsComponent, SecondarySpinnerComponent],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.scss'
})
export class ConfirmOrderComponent implements OnInit {
  reviewOrderModel!: IReviewOrder;

  //selected offer properties
  selectedOfferId?: number;
  selectedOffer?: IOffer;

  //spinner properties
  isOrderLoading = false;

  //notification properties
  notificationDurationInSeconds = 5;
  constructor(private cartService: CartService,
    private accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private orderService: OrderService,
    private adminNotificationsService: AdminNotificationsService
  ) {
  }

  //life cycle hooks
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
      this.isOrderLoading = false;
      this.reviewOrderModel = data
    },
    error: (err: Error) => {
      this.isOrderLoading = false;
      this.showNotification("تعذر تحميل الطلب. الرجاء المحاولة مرة أخرى", false);
    }
  }


  getOfferModifiedPriceObserver = {
    next: (data: IOrderModifiedPrice) => {
      this.isOrderLoading = false;
      this.reviewOrderModel.finalPriceAfterOffer = data.offerFinalPrice;
      this.reviewOrderModel.finalPrice = data.cartFinalPrice;
    },
    error: (err: Error) => {
      this.isOrderLoading = false;
      this.showNotification("تعذر تحميل الطلب. الرجاء المحاولة مرة أخرى", false);
    }
  }
  
  //methods
  getUserOrderInfo(userId: number) {
    this.isOrderLoading = true;
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

  setSelectedOfferDetails(offerId: number) {
    this.selectedOfferId = offerId;
    this.selectedOffer = this.reviewOrderModel.applicableOffers.find(offer=>offer.offerId == this.selectedOfferId);
  }

  getOrderModifiedPrice(offerId: number) {
    this.isOrderLoading = true;
    this.orderService.getOrderModifiedPrice(offerId, this.getUserId()).subscribe(this.getOfferModifiedPriceObserver)
  }

  selectOffer(event: any) {
    this.setSelectedOfferDetails(event.target.value);
    this.getOrderModifiedPrice(event.target.value);
  }

  confirmOrder() {
    let dialogRef = this.dialog.open(SendOrderComponent, {
      data: {userId: this.getUserId(), offerId: this.selectedOfferId}
    })

    dialogRef.afterClosed().subscribe(result=>{
      if (result) {
        this.adminNotificationsService.getNumberOfPendingOrders();
        this.showNotification("تم تأكيد الطلب بنجاح", true);
        localStorage.removeItem("cart");
        this.cartService.changeNumberOfItemsInCart(0);
        this.router.navigate(['/customer-products/customer-previous-orders/customer'])
      }
    })
  }
}
