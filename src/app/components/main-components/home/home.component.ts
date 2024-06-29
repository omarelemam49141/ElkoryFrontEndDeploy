import { Component, OnInit } from '@angular/core';
import { ProductsListComponent } from '../../customer-products/products-list/products-list.component';
import { AdminProductsListComponent } from '../../admin-products/admin-products-list/admin-products-list.component';
import { OfferComponent } from '../../offer/offer.component';
import { ViewProfileComponent } from '../../customer-account/view-profile/view-profile.component';
import { EditProfileComponent } from '../../customer-account/edit-profile/edit-profile.component';
import { ProductsWishListComponent } from '../../customer-products/products-wish-list/products-wish-list.component';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductsListComponent,AdminProductsListComponent,OfferComponent,ViewProfileComponent,EditProfileComponent,ProductsWishListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  constructor(private accountService: AccountService, private router: Router) {
  }
  ngOnInit(): void {
    if (this.accountService.getTokenRole().toLowerCase()=="admin") {
      this.router.navigate(["/admin-products"]);
    }
  }
}
