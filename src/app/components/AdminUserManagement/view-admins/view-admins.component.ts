import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { IAdmin } from '../../../Models/iadmin';
//import from '@angular/common' to user *ngFor
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-view-admins',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-admins.component.html',
  styleUrl: './view-admins.component.scss'
})
export class ViewAdminsComponent {

  adminsList:IAdmin[]=[];

  constructor(private adminService:AdminService){}

  ngOnInit(): void {
    this.adminService.GetAllUsers().subscribe( (data) => {
      this.adminsList = data.filter(admin => admin.role === 0);
    })

  }
}
