import { Injectable, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { Subscription } from 'rxjs';
import { IOrdersStats } from '../Models/iorders-stats';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationsService{
  numberOfPendingOrders: number = 0;

  //subscription properties
  subscriptions: Subscription[] = [];

  constructor(private ordersService: OrderService) { }

  //methods
  getNumberOfPendingOrders() {
    this.subscriptions.push(this.ordersService.getAllOrdersStats().subscribe({
        next: (data: IOrdersStats) => {
          this.numberOfPendingOrders = data.totalPendingOrders;
          console.log(data)
        },
        error: (error: any) => {
          console.log("تعذر جلب بيانات الطلبات");
        }
      })
    )
  }


}
