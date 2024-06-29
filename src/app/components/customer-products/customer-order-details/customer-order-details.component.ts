import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { IPreviousOrders } from '../../../Models/iprevious-orders';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';

@Component({
  selector: 'app-customer-order-details',
  standalone: true,
  imports: [MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  CommonModule],
  templateUrl: './customer-order-details.component.html',
  styleUrl: './customer-order-details.component.scss'
})
export class CustomerOrderDetailsComponent {
  orderStatus: string[] = ["Pending", "Shipped", "Delivered", "Cancelled"];

  //notification properties
  notificationDurationInSeconds = 5;
  constructor(public dialogRef: MatDialogRef<CustomerOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPreviousOrders,
  private orderService: OrderService,
  private snackBar: MatSnackBar) {  
  }
  
  //observers
  changeStatusObserver = {
    next: () => {
      this.showNotification("تم تغيير حالة الطلب بنجاح", true);
      this.dialogRef.close(true);
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
  changeStatus(orderNewStatus: string) {
    this.orderService.changeOrderStatus(this.data.orderId, this.orderStatus.indexOf(orderNewStatus)).subscribe(this.changeStatusObserver);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
