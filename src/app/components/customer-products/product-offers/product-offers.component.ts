import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';
import { IOffer } from '../../../Models/ioffer';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-offers',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CommonModule, SecondarySpinnerComponent,SecondarySpinnerComponent],
  templateUrl: './product-offers.component.html',
  styleUrl: './product-offers.component.scss'
})
export class ProductOffersComponent implements OnInit,OnDestroy{
  productId: number=22;

  offers!: IOffer[];
  //subscription properties
  subscriptions: Subscription[] = [];
  //notifications properties
  notificationDurationInSeconds = 5;
  //spinners properties
  isoffersLoading: boolean = false;
  constructor(private offerService:OfferService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {}


   //start observers
   offerObserver = {
    next: (data: IOffer[]) => {
      this.isoffersLoading = false;
      this.offers = data;
    },
    error: (error: any) => {
      // this.snackBar.openFromComponent(FailedSnackbarComponent, {
      //   data: 'تعذر تحميل العروض!',
      //   duration: this.notificationDurationInSeconds * 1000
      // })
      this.isoffersLoading = false;
    },
  }
getOffersByProductID(){
  this.subscriptions.push(
  this.offerService.getProductOffers(this.productId).subscribe(this.offerObserver)
    
  );

 
}

  ngOnDestroy(): void {

  this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
  ngOnInit(): void {
    this.getOffersByProductID();
  }

}
