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
import { CartService } from '../../../services/cart.service';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
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
  pageSize = 12
  pageNumber = 0;
  productsTotalAmount = 0;
  quantity :number[] = [];

  //sorting properties
  sortingOption = 'all';

  //notifications properties
  snackBarDurationInSeconds = 5;

  subscriptions?: Subscription[];
//temp user
userLoggedID!:number;

wishList?:IProduct[];





  constructor(private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private wishListService:WishListService,
    private cartService: CartService,
    private accountService: AccountService

  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }
  ngOnInit(): void {

    this.getProductsPaginated(1,12);
    this.userLoggedID=this.accountService.getTokenId();

    if(this.userLoggedID){this.fetchWishList(this.userLoggedID);}



  }

  /*start observers*/

  listObserver = {
    next: (data: ProductsPagination) => {
      this.products = data.items;
      for (let i = 0; i < this.products.length; i++) {
     
        this.quantity[i]=1;
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
  addToCart(product: IProduct,locationInlist:number): void {
    const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
    
    const existingProduct = (cart.productsAmounts?.find(p => p.productId === product.productId));
    
    if (existingProduct) {
      if(this.isProductReachedMaxAmount(product)){
        this.snackBar.open('تم بلوغ الحد الأقصى للمنتج', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
        return;
      }
      existingProduct.amount += 1;
      let cartToUpdateInDatabase = this.modifyCartAndAddItToLocalStorage(cart, product)

      let userId = this.accountService.getTokenId();
      if (userId) {
        this.updateCartInDatabase(cartToUpdateInDatabase);
      } else {
        this.snackBar.open('تم أضافة قطعة اخرى من المنتج إلى السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
      }
    } else {
      let newCartItme: IProduct = product;
      newCartItme.amount = 1;
      cart.productsAmounts.push(product);
      cart.numberOfUniqueProducts += 1;
      this.modifyCartAndAddItToLocalStorage(cart, product)

      let userId = this.accountService.getTokenId();
      if (userId) {
        this.addItemToCart(product);
      } else {
        this.snackBar.open('تم أضافة قطعة اخرى من المنتج إلى السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
      }
    }
  }

  updateCartInDatabase(cart:ICart) {
    this.cartService.updateCart(cart).subscribe({
      next: (data) => {
        this.showNotification("تم أضافة قطعة اخرى من المنتج إلى السلة", true);
      },
      error: (err: Error) => {
        this.showNotification("تعذر أضافة قطعة اخرى من المنتج إلى السلة", false);
      }
    })
  }

  modifyCartAndAddItToLocalStorage(cart: ICart, product: IProduct) {
    cart.finalPrice += (product.finalPrice* this.quantity[locationInlist]);
    cart.numberOfProducts += this.quantity[locationInlist];

    
    localStorage.setItem('cart', JSON.stringify(cart));

    return cart;
  }

  addItemToCart(item: IProduct) {
    this.cartService.addToCart(item).subscribe({
      next: (data) => {
        this.showNotification("تم أضافة المنتج إلى السلة بنجاح", true);
      },
      error: (err: Error) => {
        this.showNotification("تعذر اضافة المنتج الى السلة", false);
      }
    });
  }

  showNotification(message:string, success:boolean) {
    if (success) {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: message,
        duration: this.snackBarDurationInSeconds * 1000
      })
    } else {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: message,
        duration: this.snackBarDurationInSeconds * 1000
      })
    }
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
      this.fetchWishList(this.userLoggedID!);
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
  return cart.productsAmounts?.some(p=>p.productId===productId);

}
removeFromWishList(wishListProduct: { UserId: number, ProductId: number }): void {
  this.wishListService.deleteWishListProduct(wishListProduct.UserId, wishListProduct.ProductId).subscribe(
    () => {
      this.fetchWishList(this.userLoggedID!);
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
  const existingProduct = (cart.productsAmounts?.find(p => p.productId === product.productId));
  if(existingProduct){
    return existingProduct.amount>=product.amount;
  }
  return false;
}

increaseQuantity(index:number): void {
    // if (this.product && this.quantity < this.product.amount) {
    //   this.quantity++;
    // } else {
    //   this.snackBar.open('لا يوجد كمية كافية في المخزون', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
    // }
    if (this.quantity[index] < this.products[index].amount) {
      this.quantity[index]++;
    }
    else {
      this.snackBar.open('لا يوجد كمية كافية في المخزون', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
    }
  }

  decreaseQuantity(index:number): void {
    // if (this.quantity > 1) {
    //   this.quantity--;
   // }
    if (this.quantity[index] > 1) {
      this.quantity[index]--;
    }
  }
  removeFromCart(product: IProduct): void {
    const cart: any = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
    const productIndex = cart.productsAmounts.findIndex((p: any) => p.productId === product.productId);
    if (productIndex !== -1) {
      const productAmount = cart.productsAmounts[productIndex].amount;
      cart.productsAmounts.splice(productIndex, 1);
      cart.numberOfUniqueProducts -= 1;
      cart.numberOfProducts -= productAmount;
      cart.finalPrice -= product.finalPrice * productAmount;
      localStorage.setItem('cart', JSON.stringify(cart));
      this.snackBar.open('تم إزالة المنتج من السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
    }
  }

}
