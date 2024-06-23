import { Component } from '@angular/core';
import { IAdmin } from '../../../Models/iadmin';
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

  newAdmin: IAdmin = {
    userId: 0,
    fName: '',
    lName: '',
    email: '',
    phone: 0,
    governorate: 'MMMM',
    city: 'MMM',
    street: 'MMM',
    postalCode: 0,
    isDeleted: false,
    role: 0
  };

  constructor(public adminService: AdminService) {}

  AddNewAdmin(){
    this.adminService.AddAdmin(this.newAdmin).subscribe( (data) => {
      console.log(data);
    })
  }


}
