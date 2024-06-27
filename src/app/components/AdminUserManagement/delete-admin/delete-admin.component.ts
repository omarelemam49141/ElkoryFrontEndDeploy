import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';

@Component({
  selector: 'app-delete-admin',
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
  templateUrl: './delete-admin.component.html',
  styleUrl: './delete-admin.component.scss'
})
export class DeleteAdminComponent {
  //notification properties
  notificationDurationInSeconds = 5;

  constructor(public dialogRef: MatDialogRef<DeleteAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {adminId: number, adminName: string},
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private router: Router) {    
  }

  //observers
  deleteAdminObsrever = {
      next: () => {
        this.showNotification('تم حذف الأدمن بنجاح', true);
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        console.log(err)
        this.showNotification('تعذر حذف الأدمن', false);
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

  confirmAdminDelete() {
    this.adminService.DeleteUser(this.data.adminId).subscribe(this.deleteAdminObsrever)
  }
  onNoClick() {
    this.dialogRef.close();
  }

}
