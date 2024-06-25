import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { IUser } from '../../../Models/iuser';
import { CommonModule } from '@angular/common'
import { Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-view-admins',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './view-admins.component.html',
  styleUrl: './view-admins.component.scss'
})
export class ViewAdminsComponent {

  adminsList:IUser[]=[];

  constructor(private adminService:AdminService, private router: Router){}

  ngOnInit(): void {
    this.adminService.GetAllUsers().subscribe( (data) => {
      this.adminsList = data.filter(admin => admin.role === 0);
    })

  }

  confirmDelete(adminId: number): void {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.deleteAdmin(adminId);
    }
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
