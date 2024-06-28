import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { IPreviousOrders } from '../../../Models/iprevious-orders';
import { CommonModule } from '@angular/common';

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
  constructor(public dialogRef: MatDialogRef<CustomerOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPreviousOrders) {  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
