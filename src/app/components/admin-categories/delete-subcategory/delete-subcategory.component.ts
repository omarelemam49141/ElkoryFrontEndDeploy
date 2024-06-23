import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';

@Component({
  selector: 'app-delete-subcategory',
  standalone: true,
  imports: [MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './delete-subcategory.component.html',
  styleUrl: './delete-subcategory.component.scss'
})
export class DeleteSubcategoryComponent {
  //subscriptions properties
  subscriptions: Subscription[] = [];

  //notifications properties
  notificationDurationInSeconds = 5;

  constructor(public dialogRef: MatDialogRef<DeleteSubcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {subCategoryId: number, subCategoryName: string},
    private snackBar: MatSnackBar,
    private http: HttpClient) {  
  }

  confirmSubCategoryDelete() {
    this.subscriptions.push(this.http.delete(`${environment.apiUrl}/subCategory?subId=${this.data.subCategoryId}`).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: "تم حذف القسم الفرعى بنجاح!",
          duration: this.notificationDurationInSeconds * 1000
        })
      },
      error: () => {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: "تعذر حذف القسم الفرعى!",
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
