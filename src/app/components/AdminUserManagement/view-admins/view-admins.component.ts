import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { IUser } from '../../../Models/iuser';
import { CommonModule } from '@angular/common'
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAdminComponent } from '../delete-admin/delete-admin.component';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';


@Component({
  selector: 'app-view-admins',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, SecondarySpinnerComponent],
  templateUrl: './view-admins.component.html',
  styleUrl: './view-admins.component.scss'
})
export class ViewAdminsComponent {
  adminsList:IUser[]=[];

  //spinners properties
  isAdminsLoading: boolean = false;

  //notifications properties
  notificationDurationInSeconds = 5;

  constructor(private adminService:AdminService, private router: Router
    , private dialog: MatDialog,
    private snackBar: MatSnackBar
  ){}

  //life cycle hooks
  ngOnInit(): void {
    this.getAllAdmins();
  }

  //methods
  getAllAdmins() {
    this.isAdminsLoading = true;
    this.adminService.GetAllUsers().subscribe( {
        next: (data) => {
          this.isAdminsLoading = false;
          this.adminsList = data.filter(admin => admin.role === 0);
        },
        error: (err) => {
          this.isAdminsLoading = false;
          this.showNotification("تعذر عرض المدراء", false);
        }
    })
  }

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

  confirmDelete(adminId: number, adminName: string): void {
    let dialogRef = this.dialog.open(DeleteAdminComponent, {
      data: {
        adminId,
        adminName
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllAdmins();
      }
    })
  }

  deleteAdmin(adminId: number): void {
    this.adminService.DeleteUser(adminId).subscribe(() => {
      this.adminsList = this.adminsList.filter(admin => admin.userId !== adminId);
      alert('Admin deleted successfully');
    });

  }

  navigateToAddAdmin(): void {
    this.router.navigate(['/admin-user-management/add-admin']);
  }

}
