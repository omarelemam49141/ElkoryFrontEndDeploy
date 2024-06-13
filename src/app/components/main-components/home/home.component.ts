import { Component } from '@angular/core';
import { ProductsListComponent } from '../../customer-products/products-list/products-list.component';
import { AdminProductsListComponent } from '../../admin-products/admin-products-list/admin-products-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductsListComponent,AdminProductsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
