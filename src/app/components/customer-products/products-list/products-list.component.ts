import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
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

import { AccountService } from '../../../services/account.service';
import { PaginatorService } from '../../../services/paginator.service';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';
import { JwtPayload } from 'jwt-decode';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe,MatPaginatorModule,CommonModule,FormsModule, OffersSliderComponent, SecondarySpinnerComponent],
  templateUrl: './products-list.component.html',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorService}],
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit, OnDestroy{
  hovering = false;
  products!: IProduct[];
  /*pagination properties*/
  pageSize = 12
  pageNumber = 0;
  productsTotalAmount = 0;
  quantity :number[] = [];

  //user properties
  userId: number = -1;

  //sorting properties
  sortingOption = 'all';

  //notifications properties
  snackBarDurationInSeconds = 5;

  //spinner properties
  isProductsLoading = false;

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
  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }
  ngOnInit(): void {
    this.userId = this.accountService.getTokenId();

    this.getProductsPaginated(1,12);
    this.userLoggedID=this.accountService.getTokenId();

    if(this.userLoggedID){this.fetchWishList(this.userLoggedID);}



  }

  /*start observers*/

  listObserver = {
    next: (data: ProductsPagination) => {
      console.log(data)
      this.isProductsLoading = false;
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
      this.isProductsLoading = false;
    }
  };

  getProductsPaginated(pageNumber:number, pageSize:number): void {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize; 
    this.isProductsLoading = true;
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
 
      let cart: ICart = JSON.parse(localStorage.getItem('cart')|| '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
      let userId = this.accountService.getTokenId();
      console.log(cart)
      let newCartItme={
        productId:product.productId,
        amount:this.quantity[locationInlist],
        categoryId:product.categoryId,
        categoryName:product.categoryName,
        description:product.description,
        discount:product.discount,
        finalPrice:product.finalPrice,
        name:product.name,
        originalPrice:product.originalPrice,
        productImages:product.productImages,
        allAmount:product.amount


      }
    
    // const existingProduct = (cart.productsAmounts?.find(p => p.productId === product.productId));
    
    // if (existingProduct) {
    //   if(this.isProductReachedMaxAmount(product)){
    //     this.snackBar.open('تم بلوغ الحد الأقصى للمنتج', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
    //     return;
    //   }
    //   let userId = this.accountService.getTokenId();

    
    //   if(userId){
    //     cart.userId=this.userLoggedID;
    //   }

    //   existingProduct.amount += 1;
    //   let cartToUpdateInDatabase = this.modifyCartAndAddItToLocalStorage(cart, product,locationInlist)

    //   if (userId) {
    //     this.updateCartInDatabase(cartToUpdateInDatabase);
    //     cart.userId=this.userLoggedID;
    //   } else {
    //     this.snackBar.open('تم أضافة قطعة اخرى من المنتج إلى السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
    //   }
    // } else {
      
    


      if (userId) 
        {
        cart.userId=this.userLoggedID;

        this.addItemToCart(product,this.quantity[locationInlist]);
        } 
      else 
      {
        this.showNotification("تم أضافة قطعة من المنتج إلى السلة", true);
      }
      cart.productsAmounts.push(newCartItme);
      cart.numberOfUniqueProducts += 1;
      this.modifyCartAndAddItToLocalStorage(cart, product,locationInlist)


    // }
  }

  updateCartInDatabase(cart:ICart) {
    this.cartService.updateCart(cart).subscribe({
      next: (data) => {
        this.showNotification("تم أضافة قطعة اخرى من المنتج إلى سلة مشترياتك", true);
      },
      error: (err: Error) => {
        this.showNotification("تعذر أضافة قطعة اخرى من المنتج إلى سلة مشترياتك", false);
      }
    })
  }

  modifyCartAndAddItToLocalStorage(cart: ICart, product: IProduct,locationInlist:number) {
    cart.finalPrice += (product.finalPrice* this.quantity[locationInlist]);
    cart.numberOfProducts += this.quantity[locationInlist];

    
    localStorage.setItem('cart', JSON.stringify(cart));

    this.cartService.changeNumberOfItemsInCart(cart.numberOfUniqueProducts);

    return cart;
  }

  addItemToCart(item: IProduct,amount:number) {
    this.cartService.addToCart(item,amount).subscribe({
      next: (data) => {
        this.showNotification("تم أضافة المنتج إلى سلة مشترياتك بنجاح", true);
        console.log("adding to cart api")
      },
      error: (err: Error) => {
        this.showNotification("تعذر اضافة المنتج الى سلة مشترياتك", false);
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
      this.cartService.changeNumberOfItemsInCart(cart.numberOfUniqueProducts);

      if(this.userLoggedID){
        this.cartService.deleteProductFromCart(this.userLoggedID, product.productId).subscribe({
          next: (data) => {
            this.snackBar.open('تم إزالة المنتج من السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
          },
          error: (err: Error) => {
            this.snackBar.open('حدث خطأ أثناء إزالة المنتج من السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
          }
        });
      }
this.showNotification("تم إزالة المنتج من السلة", false);
    }
    
  }

}
