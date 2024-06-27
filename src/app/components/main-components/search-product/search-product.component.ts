import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorService } from '../../../services/paginator.service';
import { IProduct } from '../../../Models/iproduct';
import { ProductsPagination } from '../../../Models/products-pagination';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginator],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.scss',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorService}],
})
export class SearchProductComponent {
  constructor(private productService: ProductService,
    private router: Router
  ) {
  }

  /*pagination properties*/ 
  pageSize = 10;
  pageNumber = 0;
  productsTotalAmount = 0;

  //search properties
  searchValue = '';
  searchCloseInput = true;
  searchCloseDiv = true;
  searchText = null;
  products: IProduct[] = [];

  //observers
  searchingObserver = {
    next: (data: ProductsPagination) => {
      this.products = data.items;
      this.pageSize = data.pageSize;
      this.pageNumber = data.pageNumber - 1;
      this.productsTotalAmount = data.totalItems;
    }
  }

  //methods
  searchingStatus() {
    if (this.searchValue == '' ||  this.searchValue.replace(/\s/g, '') == '' || (this.searchCloseInput == true && this.searchCloseDiv == true)) {
      return 'none';
    } else {
      return 'block'
    }
  }

  closeSearchingArea() {
    this.searchCloseDiv = true;
  }

  searching(pageNumber: number = 1, pageSize: number = 10) {
    console.log(pageNumber, pageSize);
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.productService.searchByProductName(this.searchValue, pageNumber, pageSize).subscribe(this.searchingObserver);
  }

  productDetails(productId: number) {
    this.router.navigate(['/customer-products/product-details', productId]);
  }
}
