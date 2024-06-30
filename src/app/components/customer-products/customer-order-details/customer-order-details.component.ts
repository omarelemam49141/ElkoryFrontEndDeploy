import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { IPreviousOrders } from '../../../Models/iprevious-orders';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { AccountService } from '../../../services/account.service';
import { MatInputModule } from '@angular/material/input';
import { AdminNotificationsService } from '../../../services/admin-notifications.service';

@Component({
  selector: 'app-customer-order-details',
  standalone: true,
  imports: [MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatInputModule,
  CommonModule],
  templateUrl: './customer-order-details.component.html',
  styleUrl: './customer-order-details.component.scss'
})
export class CustomerOrderDetailsComponent {
  orderStatus: string[] = ["pending", "accepted", "shipped", "delivered", "cancelled"];

  //notification properties
  notificationDurationInSeconds = 5;
  constructor(public dialogRef: MatDialogRef<CustomerOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPreviousOrders,
  private orderService: OrderService,
  private snackBar: MatSnackBar,
  public accountService: AccountService,
private adminNotificationsService: AdminNotificationsService) {  
  }

  //observers
  changeStatusObserver = {
    next: () => {
      this.showNotification("تم تغيير حالة الطلب بنجاح", true);
      this.dialogRef.close(true);
      this.adminNotificationsService.getNumberOfPendingOrders();

    },
    error: (error: Error) => {
      this.showNotification("تعذر تغيير حالة الطلب", false);
    }
  }

  //methods
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
  changeStatus(orderNewStatus: string, shippingDurationInDays?: string) {
    if (shippingDurationInDays) {
      this.orderService.changeOrderStatus(this.data.orderId, this.orderStatus.indexOf(orderNewStatus), +shippingDurationInDays).subscribe(this.changeStatusObserver);
    } else {
      this.orderService.changeOrderStatus(this.data.orderId, this.orderStatus.indexOf(orderNewStatus)).subscribe(this.changeStatusObserver);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
