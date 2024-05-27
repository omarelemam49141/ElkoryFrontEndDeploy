import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopHeaderComponent } from './components/main-components/top-header/top-header.component';
import { NavbarComponent } from './components/main-components/navbar/navbar.component';
import { FooterComponent } from './components/main-components/footer/footer.component';
import { ViewAdminsComponent } from './components/AdminUserManagement/view-admins/view-admins.component';
import { AddAdminComponent } from './components/AdminUserManagement/add-admin/add-admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopHeaderComponent, NavbarComponent, FooterComponent, ViewAdminsComponent,AddAdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ElkoryEcommerce';
}
