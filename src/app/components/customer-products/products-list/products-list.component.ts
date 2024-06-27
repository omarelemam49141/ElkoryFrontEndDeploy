import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
import { WishListService } from '../../../services/wishList.service';
import { IAddWishListProduct } from '../../../Models/Iadd-wishListproduct';
import { IUser } from '../../../Models/iuser';
import { IwhishListProduct } from '../../../Models/IwishListProduct';
import { OffersSliderComponent } from '../../main-components/offers-slider/offers-slider.component';
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe,MatPaginatorModule,CommonModule,FormsModule, OffersSliderComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit, OnDestroy,OnChanges{
  hovering = false;
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
//temp user
user: IUser = {
  userId: 3,
  fName: 'Ahmad',
  lName: 'Esam',
  email: 'ahmad.esam@ex.com',
  password: '123',
  phone: "1015328933",
  governorate: 'Ghatbia',
  city: 'MAhalla',
  street: 'Farouk21',
  postalCode: "12345",
  isDeleted: false,
  role: 1
};

wishList?:IwhishListProduct[];





  constructor(private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private wishListService:WishListService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }
  ngOnInit(): void {
    this.getProductsPaginated(1,10);
    this.fetchWishList(this.user.userId!);   
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
    
    const existingProduct = (cart.productsAmounts.find(p => p.productId === product.productId));
    console.log( `the product from cart is ${existingProduct?.amount}`);
      console.log(`the product from product list ${product.amount}`)
    
    if (existingProduct) {
      

      if(this.isProductReachedMaxAmount(product)){
        this.snackBar.open('تم بلوغ الحد الأقصى للمنتج', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
        return;
      }


      existingProduct.amount += 1;
      this.snackBar.open('تم أضافة قطعة اخرى من المنتج إلى السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });

    } else {
      let newCartItme={
        productId:product.productId,
        amount:1,
        categoryId:product.categoryId,
        categoryName:product.categoryName,
        description:product.description,
        discount:product.discount,
        finalPrice:product.finalPrice,
        name:product.name,
        originalPrice:product.originalPrice,
        productImages:product.productImages,
      

      }
     
      cart.productsAmounts.push(newCartItme);
      cart.numberOfUniqueProducts += 1;
      this.snackBar.open('تم إضافة المنتج إلى السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });

    }

    cart.finalPrice += product.finalPrice;
    cart.numberOfProducts += 1;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
  }

fetchWishList(UserId:number){
  this.wishListService.getWishList(UserId).subscribe(
    (data)=>{
      console.log("from success section")
      console.log(data);
      this.wishList=data;
   
     
      
    },
    (error)=>{
      console.log("error section")
      console.log(error);
      
    }
    
  );
 

}
  addProductToWishList(item:IAddWishListProduct)
{
  this.wishListService.addWishListProduct(item).subscribe({
    next: (data: any) => {
      console.log("from success section")
      this.snackBar.open('تم إضافة المنتج إلى القائمة المفضلة ', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
      this.fetchWishList(this.user.userId!);
    },
    error: (err: Error)=> {
      console.log("error section")
      console.log(err);
      this.snackBar.open('حدث خطأ أثناء إضافة المنتج إلى  القائمة المفضلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
    }
  })
}

isProductInWishlist(productId:number):boolean{
  if(!this.wishList){
    return false;
  }
  return this.wishList.some(p=>p.productId===productId);
}
isProductInCart(productId:number){
  const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
  return cart.productsAmounts.some(p=>p.productId===productId);

}
removeFromWishList(wishListProduct: { UserId: number, ProductId: number }): void {
  this.wishListService.deleteWishListProduct(wishListProduct.UserId, wishListProduct.ProductId).subscribe(
    () => {
      this.fetchWishList(this.user.userId!);
      this.snackBar.open('تم حذف المنتج من القائمة المفضلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 })
    },
    (error) => {
      console.error('Error removing product from wishlist:', error);
      this.snackBar.open('حدث خطأ أثناء حذف المنتج من القائمة المفضلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
    }
  );
}
isProductReachedMaxAmount(product:IProduct):boolean{
  const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
  const existingProduct = (cart.productsAmounts.find(p => p.productId === product.productId));
  if(existingProduct){
    return existingProduct.amount>=product.amount;
  }
  return false;
}

}
