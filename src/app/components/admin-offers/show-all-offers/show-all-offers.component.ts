import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GenericService } from '../../../services/generic.service';
import { IOffer } from '../../../Models/ioffer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteOfferComponent } from '../delete-offer/delete-offer.component';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';

@Component({
  selector: 'app-show-all-offers',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CommonModule, SecondarySpinnerComponent],
  templateUrl: './show-all-offers.component.html',
  styleUrl: './show-all-offers.component.scss'
})
export class ShowAllOffersComponent implements OnInit, OnDestroy{
  offers!: IOffer[];
  //subscription properties
  subscriptions: Subscription[] = [];
  //notifications properties
  notificationDurationInSeconds = 5;
  //spinners properties
  isoffersLoading: boolean = false;

  constructor(private genericService: GenericService<IOffer>,
              private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {
  }

  //start observers
  offerObserver = {
    next: (data: IOffer[]) => {
      this.isoffersLoading = false;
      this.offers = data;
    },
    error: (error: any) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تحميل العروض!',
        duration: this.notificationDurationInSeconds * 1000
      })
      this.isoffersLoading = false;
    },
  }

  ngOnInit(): void {
    this.getAllOffers();
  }

  getAllOffers() {
    this.isoffersLoading = true;
    this.subscriptions.push(this.genericService.getAll('Offers').subscribe(this.offerObserver));
  }

  offerIsExpired(offerDate: Date, offerDuration: number): boolean {
    let todayDate = new Date();
    let offerEndDate = new Date(offerDate);
    offerEndDate.setDate(offerEndDate.getDate() + offerDuration);
    return todayDate > offerEndDate;
  }

  confirmOfferDelete(offerId: number, offerTitle:string): void {
    const dialogRef = this.dialog.open(DeleteOfferComponent, {
      data: {offerId, offerTitle},
    });

    //reload the offers after the deletion is completed
    dialogRef.afterClosed().subscribe(result => {
      this.getAllOffers();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
}
