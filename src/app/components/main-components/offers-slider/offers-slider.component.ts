import { ChangeDetectorRef, Component, OnInit, ApplicationRef } from '@angular/core';
import { IOffer } from '../../../Models/ioffer';
import { GenericService } from '../../../services/generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { IgxCarouselModule, IgxSliderModule } from 'igniteui-angular';

@Component({
  selector: 'app-offers-slider',
  standalone: true,
  imports: [ 
     RouterLink,
    CurrencyPipe, DatePipe, IgxCarouselModule,
    IgxSliderModule, CommonModule],
  templateUrl: './offers-slider.component.html',
  styleUrls: ['./offers-slider.component.scss', './../../admin-offers/offer-details/offer-details.component.scss']
})
export class OffersSliderComponent implements OnInit {
  // offers properties
  offers: IOffer[] = [];

  // carousel properties
  responsiveOptions: any[] = [];

  // notifications properties
  notificationDurationInSeconds = 5;

  constructor(
    private genericService: GenericService<IOffer>,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  // life cycle hooks
  ngOnInit() {
    this.getAllOffers();
    this.setCarouselOptions();
  }

  // observers
  getAllOffersObserver = {
    next: (data: IOffer[]) => {
      this.offers = data;
      console.log('Offers:', this.offers);
      this.cdr.detectChanges();
      this.appRef.tick();
    },
    error: (error: any) => {
      this.showNotification('تعذر تحميل العروض!', false);
    }
  };

  // methods
  showNotification(message: string, success: boolean) {
    if (success) {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: message,
        duration: this.notificationDurationInSeconds * 1000
      });
    } else {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: message,
        duration: this.notificationDurationInSeconds * 1000
      });
    }
  }

  setCarouselOptions() {
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  getAllOffers() {
    this.genericService.getAll('Offers').subscribe(this.getAllOffersObserver);
  }
}
