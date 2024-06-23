import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IProduct } from '../../../Models/iproduct';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from '../../../services/product.service';
import { ProductsPagination } from '../../../Models/products-pagination';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { IOfferProduct } from '../../../Models/ioffer-product';
import { OfferService } from '../../../services/offer.service';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';

@Component({
  selector: 'app-add-offer-product',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    ProductCardComponent,
    CommonModule
  ],
  templateUrl: './add-offer-product.component.html',
  styleUrl: './add-offer-product.component.scss'
})
export class AddOfferProductComponent implements OnInit{
  //searching products pagination properties
  searchedProductsPageSize=5;
  searchedProductsPageNumber=1;
  totalPages = 0;
  totalItems = 0;
  searchedProducts: IProduct[] = [];

  //edit product data
  productToEdit!: IProduct;

  //form properties
  addProductForm!: FormGroup;

  //notifications properties
  notificationDurationInSeconds = 5;

  constructor(
    public dialogRef: MatDialogRef<AddOfferProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {offerId: number, offerTitle: string, productId?: number, productAmount?: number, discount?: number},
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private offerService: OfferService
  ) {
    this.addProductForm = this.fb.group({
      offerId: [this.data.offerId, [Validators.required]],
      productId: [this.data.productId??'', [Validators.required]],
      productAmount: [this.data.productAmount??'', [Validators.required, Validators.min(1)]],
      discount: [this.data.discount??'', [Validators.min(0), Validators.max(100)]],
    })
  }
  ngOnInit(): void {
    if (this.data.productId) {
      this.productService.getById(this.data.productId).subscribe({
        next: (product: IProduct) => {
          this.productToEdit = product;
        },
        error: (err: Error) => {
          this.snackBar.openFromComponent(FailedSnackbarComponent, {
            data: "تعذر تحميل المنتج",
            duration: this.notificationDurationInSeconds * 1000
          })
        }
      })
    }
  }

  //observer properties
  searchedProductsObserver = {
    next: (data: ProductsPagination) => {
      this.totalPages = data.totalPages;
      this.totalItems = data.totalItems;
      this.searchedProducts = data.items;
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "تعذر تحميل المنتجات",
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  searchProductByName(productName: string) {
    if (!productName) {
      this.searchedProducts = [];
      return;
    } 
    this.productService.searchByProductName(productName, this.searchedProductsPageNumber, this.searchedProductsPageSize)
                        .subscribe(this.searchedProductsObserver)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addProductToForm(productToAddToForm: IOfferProduct): void {
    if (this.productAmount?.valid && this.discount?.valid) {
      this.addProductForm.patchValue({
        productId: productToAddToForm.productId,
      });

      let offerProduct: IOfferProduct = {
        productId: this.addProductForm.value.productId,
        productAmount: this.addProductForm.value.productAmount,
        discount: this.addProductForm.value.discount
      }
  
      this.offerService.addProductToOffer(+this.offerId?.value, offerProduct).subscribe({
        next: () => {
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: "تمت اضافة المنتج بنجاح",
            duration: this.notificationDurationInSeconds * 1000
          })
          this.dialogRef.close(true);
        },
        error: (error: Error) => {
          this.snackBar.openFromComponent(FailedSnackbarComponent, {
            data: error.message,
            duration: this.notificationDurationInSeconds * 1000
          })
        }
      })
    }
  }

  updateOfferProduct(): void {
    let offerProduct: IOfferProduct = {
      productId: this.productToEdit.productId,
      productAmount: this.addProductForm.value.productAmount,
      discount: this.addProductForm.value.discount
    }

    this.offerService.updateProductOffer(+this.offerId?.value, +this.productId?.value, offerProduct).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: "تم تحديث المنتج بنجاح",
          duration: this.notificationDurationInSeconds * 1000
        })
        this.dialogRef.close(true);
      },
      error: (error: Error) => {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: error.message,
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    })
  }

  get offerId() {
    return this.addProductForm.get("offerId");
  }

  get productId() {
    return this.addProductForm.get("productId");
  }

  get productAmount() {
    return this.addProductForm.get("productAmount");
  }

  get discount() {
    return this.addProductForm.get("discount");
  }
}
