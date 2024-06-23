import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IProduct } from '../../../Models/iproduct';
import { ProductsPagination } from '../../../Models/products-pagination';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { FormsModule } from '@angular/forms';
import { ICart } from '../../../Models/icart';
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe,MatPaginatorModule,CommonModule,FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit, OnDestroy{
  products!: IProduct[];
  images: string[][] = [];
  /*pagination properties*/
  pageSize = 9
  pageNumber = 0;
  productsTotalAmount = 0;

  //sorting properties
  sortingOption = 'all';

  //notifications properties
  snackBarDurationInSeconds = 5;

  subscriptions?: Subscription[];

  constructor(private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }
  ngOnInit(): void {
    this.getProductsPaginated(1,10);
  }

  /*start observers*/

  listObserver = {
    next: (data: ProductsPagination) => {
      this.products = data.items;
      for (let i = 0; i < this.products.length; i++) {
        this.productService.getPictures(this.products[i].productId).subscribe((images: string[]) => {
          this.images.push(images);
        });
      }
      this.pageSize = data.pageSize;
      this.pageNumber = data.pageNumber-1;
      this.productsTotalAmount = data.totalItems;
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        duration: this.snackBarDurationInSeconds * 1000,
        data: err.message
      });
    }
  };

  getProductsPaginated(pageNumber:number, pageSize:number): void {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize; 
    if (this.sortingOption == "all") {
      this.productService.getAllWithPagination(pageNumber, pageSize).subscribe(this.listObserver);
    } else {
      this.productService.getAllWithPaginationAndSorting(pageNumber, pageSize, this.sortingOption).subscribe(this.listObserver);
    }
  }
  
  getDiscountPercentage(originalPrice: number, finalPrice: number): number {
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }
  addToCart(product: IProduct): void {
    const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
    
    const existingProduct = cart.productsAmounts.find(p => p.productId === product.productId);
    if (existingProduct) {
      existingProduct.amount += 1;
    } else {
      product.amount = 1;
      cart.productsAmounts.push(product);
      cart.numberOfUniqueProducts += 1;
    }

    cart.finalPrice += product.finalPrice;
    cart.numberOfProducts += 1;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    this.snackBar.open('تم إضافة المنتج إلى السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
  }

}
