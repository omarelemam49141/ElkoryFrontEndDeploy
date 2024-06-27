import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IOffer } from '../../../Models/ioffer';
import { GenericService } from '../../../services/generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { AddOfferProductComponent } from '../add-offer-product/add-offer-product.component';
import { MatDialog } from '@angular/material/dialog';
import { OfferService } from '../../../services/offer.service';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { DeleteOfferComponent } from '../delete-offer/delete-offer.component';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, CommonModule, RouterLink],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.scss'
})
export class OfferDetailsComponent implements OnDestroy, OnInit{
  offer!: IOffer;
  
  //customer view offer details properties
  isCustomer = false;

  productsImage: string[] = [];
  //subscription properties
  subscriptions: Subscription[] = [];
  //notifications properties
  notificationDurationInSeconds = 5;

  constructor(private genericService: GenericService<IOffer>,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private offerService: OfferService,
    private productService: ProductService
  ) {
  }

  //start observers
  private offerDetailsObserver = {
    next: (data: IOffer) => {
      this.offer = data;
      this.offer.productOffers!.forEach(product => {
        this.productService.getPictures(product.productId).subscribe(images => {
          this.productsImage.push(images[0]);
        });
      })
    },
    error: (error: any) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تحميل العرض!',
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  ngOnInit(): void {
    this.loadOfferInfo();
  }

  loadOfferInfo(): void {
    this.subscriptions.push(this.activatedRoute.paramMap.subscribe(params=>{
      let offerId = Number(params.get('id'));
      let role = params.get('role');
      if (role == "customer") {
        this.isCustomer = true;
      }
      
      if (!offerId) {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'هذا العرض غير موجود!',
          duration: this.notificationDurationInSeconds * 1000
        })
      } else {
        this.subscriptions.push(this.genericService.getById('Offers', offerId).subscribe(this.offerDetailsObserver));
      }
    }))
  }

  addOfferProduct(offerId:number, offerTitle:string, productId?: number, productAmount?: number, discount?: number): void {
    const dialogRef = this.dialog.open(AddOfferProductComponent, {
      data: {offerId, offerTitle, productId, productAmount, discount},
      width: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.loadOfferInfo();
      }
    });
  }

  deleteOfferProduct(offerId: number, productId: number): void {
    this.offerService.deleteProductFromOffer(offerId, productId).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: 'تم حذف المنتج من العرض بنجاح',
          duration: this.notificationDurationInSeconds * 1000
        })
        this.loadOfferInfo();
      },
      error: () => {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'تعذر حذف المنتج من العرض',
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    });
  }

  confirmOfferDelete(offerId: number, offerTitle:string): void {
    const dialogRef = this.dialog.open(DeleteOfferComponent, {
      data: {offerId, offerTitle},
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }


}
