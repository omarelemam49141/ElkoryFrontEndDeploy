import { Component } from '@angular/core';
import { IAdmin } from '../../../Models/iadmin';


@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [],
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
    governorate: '',
    city: '',
    street: '',
    postalCode: 0
  };

  constructor() {

  }
}
