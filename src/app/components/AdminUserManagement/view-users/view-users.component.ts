import { AdminService } from './../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IUser } from '../../../Models/iuser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.scss'
})
export class ViewUsersComponent {

  usersList:IUser[]=[];

  constructor(private AdminService:AdminService){}

  ngOnInit(): void {
    this.AdminService.GetAllUsers().subscribe( (data) => {
      this.usersList = data.filter(user => user.role === 1);
    })

  }

  confirmDelete(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.deleteUser(userId);
    }
  }

  deleteUser(userId: number): void {
    this.AdminService.DeleteUser(userId).subscribe(() => {
      this.usersList = this.usersList.filter(user => user.userId !== userId);
      alert('User deleted successfully');
    });

  }

}
