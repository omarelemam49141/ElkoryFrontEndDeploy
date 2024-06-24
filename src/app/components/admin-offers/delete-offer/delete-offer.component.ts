import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OfferService } from '../../../services/offer.service';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-offer',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule],
  templateUrl: './delete-offer.component.html',
  styleUrl: './delete-offer.component.scss'
})
export class DeleteOfferComponent {
  //notification properties
  notificationDurationInSeconds = 5;

  constructor(public dialogRef: MatDialogRef<DeleteOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {offerId: number, offerTitle: string},
    private snackBar: MatSnackBar,
    private offerService: OfferService,
    private router: Router) {    
  }

  confirmOfferDelete(): void {
    this.offerService.deleteOffer(this.data.offerId).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: 'تم حذف العرض بنجاح',
          duration: this.notificationDurationInSeconds * 1000
        })
        this.dialogRef.close();
        this.router.navigate(['/admin-offers']);
      },
      error: () => {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'تعذر حذف العرض',
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
