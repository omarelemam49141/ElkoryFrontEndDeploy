import { Component, OnDestroy, OnInit, Pipe } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../../Models/iproduct';
import { ProductService } from '../../../services/product.service';
import { Subscription } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductsPagination } from '../../../Models/products-pagination';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { PaginatorService } from '../../../services/paginator.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminDeleteProductComponent } from '../admin-delete-product/admin-delete-product.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, MatPaginatorModule, FormsModule, CommonModule],
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorService}],
  templateUrl: './admin-products-list.component.html',
  styleUrl: './admin-products-list.component.scss'
})
export class AdminProductsListComponent implements OnInit, OnDestroy{
  products!: IProduct[];
  images: string[][] = [];
  /*pagination properties*/ 
  pageSize = 10;
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
        data: 'تعذر تحميل المنتجات!',
      });
    }
  }
  //delete observer
  deleteObserver = {
    next: (data: void) => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: 'تم حذف المنتج بنجاح!',
        duration: this.snackBarDurationInSeconds * 1000
      });
      this.getProductsPaginated(1, this.pageSize);
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر حذف المنتج!',
        duration: this.snackBarDurationInSeconds * 1000
      });
    }
  }
  ngOnInit(): void {
    this.getProductsPaginated(1, 10);
  }

  getProductsPaginated(pageNumber:number, pageSize:number): void {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize; 
    if (this.sortingOption == "all") {
      this.productService.getAllWithPagination(pageNumber, pageSize).subscribe(this.listObserver);
    } else {
      this.productService.getAllWithPaginationAndSorting(pageNumber, pageSize, this.sortingOption).subscribe(this.listObserver);
    }
  }

  /*start delete process*/
  openDeleteDialog(productId:number, productName:string): void {
    const dialogRef = this.dialog.open(AdminDeleteProductComponent, {
      data: productName,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(productId);
      }
    });
  }

  private deleteProduct(productId: number): void {
    this.productService.delete(productId).subscribe(this.deleteObserver);
  }
  /*end delete process*/

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub=>sub.unsubscribe());
  }
}
