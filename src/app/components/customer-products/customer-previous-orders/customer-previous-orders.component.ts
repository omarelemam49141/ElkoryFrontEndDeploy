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
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerOrderDetailsComponent } from '../customer-order-details/customer-order-details.component';
import { IPreviousOrders } from '../../../Models/iprevious-orders';
import { IOrdersStats } from '../../../Models/iorders-stats';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';

@Component({
  selector: 'app-customer-previous-orders',
  standalone: true,
  imports: [CommonModule, MatPaginator, SecondarySpinnerComponent],
  templateUrl: './customer-previous-orders.component.html',
  styleUrl: './customer-previous-orders.component.scss',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorService}],
})
export class CustomerPreviousOrdersComponent implements OnInit{
  role: string = 'customer';

  //paginationProperties
  pageSize = 10;
  pageNumber = 1;
  totalPages = 0;

  //orders properties
  ordersType: string = 'pending';
  ordersStatuses = ['pending', 'accepted','shipped', 'delivered', 'cancelled'];
  ordersStats?: IOrdersStats;
  ordersStatusesInArabic= ['معلقة', 'مقبولة','مشحونة', 'تم تسليمها', 'ملغية']
  previousOrders: IOrdersPaginated = {} as IOrdersPaginated;
  paymentMethods = [
    "كاش عند التسليم",
    "الدفع فى الفرع",
    "الدفع ببطاقة الدفع"
  ]

  //spinners properties
  isOrdersLoading: boolean = false;

  //notification properties
  notificationDurationInSeconds = 5;
  constructor(private orderService: OrderService,
    private snackBar: MatSnackBar,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    
  }

  //observers
  getPreviousOrdersObserver = {
    next: (data: IOrdersPaginated) => {
      this.isOrdersLoading = false;
      this.previousOrders = data;
      this.pageSize = data.pageSize;
      this.pageNumber = data.pageNumber;
      this.totalPages = data.totalPages;
    },
    error: (error: Error) => {
      this.isOrdersLoading = false;
      this.showNotification('تعذر تحميل الطلبات', false);
      this.resetOrdersStatus();
    }
  }

  getOrderStatsObserver = {
    next: (data: IOrdersStats) => {
      this.ordersStats = data;
    },
    error: (error: Error) => {
      this.showNotification('تعذر تحميل احصاءات الطلبات', false);
    }
  }

  //life cycle hooks
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.role = params.get("role")?.toString().toLowerCase() || 'customer';
      this.getPreviousOrders(0, params.get("role")?.toString().toLowerCase() || 'customer');
    })
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

  getPreviousOrders(ordersType: number, role: string = 'customer') {
    this.ordersType = this.ordersStatuses[ordersType];
    if (role=="customer") {
      let userId = this.accountService.getTokenId();
      this.getPreviousOrdersByOrdersType(userId, ordersType);
      this.getOrderStats(userId);
    } else {
      this.getPreviousOrdersByOrdersType(ordersType);
      this.getOrderStats();
    }
  }

  getPreviousOrdersByOrdersType(ordersType: number, userId?:number) {
    this.isOrdersLoading = true;
    if (userId) {
      this.orderService.getCustomerPreviousOrders(userId, ordersType, this.pageNumber, this.pageSize).subscribe(this.getPreviousOrdersObserver);
    } else {
      this.orderService.getAllCustomersOrdersPaginated(ordersType, this.pageNumber, this.pageSize).subscribe(this.getPreviousOrdersObserver);
    }
  }

  getOrderStats(userId?: number) {
    if (userId) {
      this.orderService.getUserOrdersStats(userId).subscribe(this.getOrderStatsObserver);
    } else {
      this.orderService.getAllOrdersStats().subscribe(this.getOrderStatsObserver);
    }
  }

  settingOrdersBacground() {
    if (this.ordersType == 'pending') {
      return '#b6cee7';
    } else if (this.ordersType == 'shipped') {
      return '#b6e3e7';
    } else if (this.ordersType == 'delivered') {
      return '#b6cee7';
    } else if (this.ordersType == 'cancelled') {
      return '#e7b6b6';
    } else {
      return '#b6cee7';
    }
  }

  openOrderDetails(orderDetails: IPreviousOrders) {
    let dialogRef = this.dialog.open(CustomerOrderDetailsComponent, {
      data: orderDetails
    })

    dialogRef.afterClosed().subscribe(result=>{
      if(result) {
        this.getPreviousOrders(0, 'admin');
      }
    })
  }
}
