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

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, OfferDetailsComponent],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.scss'
})
export class ConfirmOrderComponent implements OnInit {
  reviewOrderModel!: IReviewOrder;

  //selected offer properties
  selectedOfferId?: number;
  selectedOffer?: IOffer;

  //notification properties
  notificationDurationInSeconds = 5;
  constructor(private cartService: CartService,
    private accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private orderService: OrderService
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
      this.reviewOrderModel = data
    },
    error: (err: Error) => {
      console.log(err)
      this.showNotification("تعذر تحميل الطلب. الرجاء المحاولة مرة أخرى", false);
    }
  }


  getOfferModifiedPriceObserver = {
    next: (data: IOrderModifiedPrice) => {
      console.log(data)
      this.reviewOrderModel.finalPriceAfterOffer = data.offerFinalPrice;
      this.reviewOrderModel.finalPrice = data.cartFinalPrice;
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

  setSelectedOfferDetails(offerId: number) {
    this.selectedOfferId = offerId;
    this.selectedOffer = this.reviewOrderModel.applicableOffers.find(offer=>offer.offerId == this.selectedOfferId);
  }

  getOrderModifiedPrice(offerId: number) {
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
        this.showNotification("تم تأكيد الطلب بنجاح", true);
        localStorage.removeItem("cart");
        this.router.navigate(['/customer-products/products-list'])
      }
    })
  }
}
