import { Component } from '@angular/core';
import { ProductsListComponent } from '../../customer-products/products-list/products-list.component';
import { AdminProductsListComponent } from '../../admin-products/admin-products-list/admin-products-list.component';
import { OfferComponent } from '../../offer/offer.component';
import { ViewProfileComponent } from '../../customer-account/view-profile/view-profile.component';
import { EditProfileComponent } from '../../customer-account/edit-profile/edit-profile.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductsListComponent,AdminProductsListComponent,OfferComponent,ViewProfileComponent,EditProfileComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
