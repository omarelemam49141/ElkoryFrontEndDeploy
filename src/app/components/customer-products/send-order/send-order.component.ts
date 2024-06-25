import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { IOrderModel } from '../../../Models/iorder-model';
import { AccountService } from '../../../services/account.service';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { GenericService } from '../../../services/generic.service';

@Component({
  selector: 'app-send-order',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './send-order.component.html',
  styleUrl: './send-order.component.scss'
})
export class SendOrderComponent implements OnDestroy{
  //form properties
  orderForm!: FormGroup;

  //notifications properties
  notificationDurationInSeconds = 5;

  //subscriptions properties
  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<SendOrderComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private accountService: AccountService,
    private genericService: GenericService<IOrderModel>,
  ) {
    this.orderForm = this.fb.group({
      governerate: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      postalCode: ['', [Validators.required]]
    })
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  submitForm() {
    let orderModel: IOrderModel = this.orderForm.value as IOrderModel;
    orderModel.userId = this.accountService.getTokenId();
    this.subscriptions.push(this.genericService.insert("Order/ConfirmWithoutOffer", orderModel).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error:(err: Error) => {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: "تعذر إرسال الطلب. الرجاء المحاولة مرة أخرى",
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    }))
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get governerate() {
    return this.orderForm.get("governerate");
  }
  get city() {
    return this.orderForm.get("city");
  }
  get street() {
    return this.orderForm.get("street");
  }
  get postalCode() {
    return this.orderForm.get("postalCode");
  }
}
