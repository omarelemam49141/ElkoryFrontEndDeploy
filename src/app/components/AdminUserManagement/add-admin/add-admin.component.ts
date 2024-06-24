import { Router, Routes } from '@angular/router';
import { Component } from '@angular/core';
import { IUser } from '../../../Models/iuser';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';


@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.scss'
})
export class AddAdminComponent {

  newAdmin: IUser = {
    userId: 0,
    fName: '',
    lName: '',
    email: '',
    phone: '',
    password: '',
    governorate: '',
    city: '',
    street: '',
    postalCode: '',
    isDeleted: false,
    role: 0
  };

  constructor(public adminService: AdminService, private router: Router) {}

  onSubmit(){
    this.adminService.AddAdmin(this.newAdmin).subscribe( (data) => {
      console.log(data);
    });
    //redirect to view-admins
    this.router.navigate(['/view-admins']);
  }

  AddNewAdmin(){
    this.adminService.AddAdmin(this.newAdmin).subscribe( (data) => {
      console.log(data);
    });
    //redirect to view-admins with refreshed data
    this.router.navigate(['/view-admins']);

  }


}
