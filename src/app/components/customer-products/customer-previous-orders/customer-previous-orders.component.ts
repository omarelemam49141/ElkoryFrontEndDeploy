import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { IOrdersPaginated } from '../../../Models/iorders-paginated';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorService } from '../../../services/paginator.service';

@Component({
  selector: 'app-customer-previous-orders',
  standalone: true,
  imports: [CommonModule, MatPaginator],
  templateUrl: './customer-previous-orders.component.html',
  styleUrl: './customer-previous-orders.component.scss',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorService}],
})
export class CustomerPreviousOrdersComponent implements OnInit{
  //paginationProperties
  pageSize = 10;
  pageNumber = 1;
  totalPages = 0;

  //orders properties
  ordersType = 'pending';
  ordersStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  previousOrders: IOrdersPaginated = {} as IOrdersPaginated;
  paymentMethods = [
    "كاش عند التسليم",
    "الدفع فى الفرع",
    "الدفع ببطاقة الدفع"
  ]

  //notification properties
  notificationDurationInSeconds = 5;
  constructor(private orderService: OrderService,
    private snackBar: MatSnackBar,
    private accountService: AccountService
  ) {
    
  }

  //observers
  getPreviousOrdersObserver = {
    next: (data: IOrdersPaginated) => {
      this.previousOrders = data;
      this.pageSize = data.pageSize;
      this.pageNumber = data.pageNumber;
      this.totalPages = data.totalPages;
    },
    error: (error: Error) => {
      this.showNotification('تعذر تحميل الطلبات', false);
      this.resetOrdersStatus();
    }
  }

  //life cycle hooks
  ngOnInit(): void {
    this.getPreviousOrders(0);
  }

  //methods
  resetOrdersStatus() {
    this.previousOrders = {} as IOrdersPaginated;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.totalPages = 0;
  }
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
  getPreviousOrders(ordersType: number) {
    let userId = this.accountService.getTokenId();
    this.ordersType = this.ordersStatuses[ordersType];
    this.orderService.getCustomerPreviousOrders(userId, ordersType, this.pageNumber, this.pageSize).subscribe(this.getPreviousOrdersObserver);
  }

  settingOrdersBacground() {
    if (this.ordersType == 'pending') {
      return '#b6cee7';
    } else if (this.ordersType == 'shipped') {
      return '#b6e3e7';
    } else if (this.ordersType == 'delivered') {
      return '#e7b6b6';
    } else if (this.ordersType == 'cancelled') {
      return '#b6e3e7';
    } else {
      return '#b6cee7';
    }
  }
}
