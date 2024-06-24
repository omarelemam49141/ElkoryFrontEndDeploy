import { Component, Inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { GenericService } from '../../../services/generic.service';
import { ICategory } from '../../../Models/icategory';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.scss'
})
export class DeleteCategoryComponent implements OnDestroy{
  //subscriptions properties
  subscriptions: Subscription[] = [];

  //notifications properties
  notificationDurationInSeconds = 5;

  constructor(public dialogRef: MatDialogRef<DeleteCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {categoryId: number, categoryName: string},
    private snackBar: MatSnackBar,
    private http: HttpClient) {  
  }

  confirmCategoryDelete() {
    this.subscriptions.push(this.http.delete(`${environment.apiUrl}/category?categoryId=${this.data.categoryId}`).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: "تم حذف القسم بنجاح!",
          duration: this.notificationDurationInSeconds * 1000
        })
      },
      error: () => {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: "تعذر حذف القسم!",
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    }))
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
