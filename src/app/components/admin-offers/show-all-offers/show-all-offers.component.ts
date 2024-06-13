import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GenericService } from '../../../services/generic.service';
import { IOffer } from '../../../Models/ioffer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-show-all-offers',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CommonModule],
  templateUrl: './show-all-offers.component.html',
  styleUrl: './show-all-offers.component.scss'
})
export class ShowAllOffersComponent implements OnInit, OnDestroy{
  offers!: IOffer[];
  //subscription properties
  subscriptions: Subscription[] = [];
  //notifications properties
  notificationDurationInSeconds = 5;

  constructor(private genericService: GenericService<IOffer>,
              private snackBar: MatSnackBar
  ) {
  }

  //start observers
  offerObserver = {
    next: (data: IOffer[]) => {
      this.offers = data;
    },
    error: (error: any) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تحميل العروض!',
        duration: this.notificationDurationInSeconds * 1000
      })
    },
  }

  ngOnInit(): void {
    this.subscriptions.push(this.genericService.getAll('Offers').subscribe(this.offerObserver));
  }

  offerIsExpired(offerDate: Date, offerDuration: number): boolean {
    let todayDate = new Date();
    let offerEndDate = new Date(offerDate);
    offerEndDate.setDate(offerEndDate.getDate() + offerDuration);
    return todayDate > offerEndDate;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
}
