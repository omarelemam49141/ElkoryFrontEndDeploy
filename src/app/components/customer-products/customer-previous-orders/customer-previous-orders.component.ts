import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-previous-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-previous-orders.component.html',
  styleUrl: './customer-previous-orders.component.scss'
})
export class CustomerPreviousOrdersComponent {
  ordersType = 'pending';
  constructor(private orderService: OrderService,
    private snackBar: MatSnackBar,
  ) {
    
  }

  pendingOrders() {
    this.ordersType = 'pending';
    // this.getPreviousOrders("pending");
  }

  getPreviousOrders() {
    
  }

  // settingOrdersBacground() {
  //   if (this.ordersType == 'pending') {
  //     return '#b6cee7';
  //   } else if (this.ordersType == 'accepted') {
  //     return '#b6e3e7';
  //   } else if (this.ordersType == 'refused') {
  //     return '#e7b6b6';
  //   }
  // }
}
