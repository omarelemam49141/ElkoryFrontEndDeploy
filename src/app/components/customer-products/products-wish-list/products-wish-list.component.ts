import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WishListService } from '../../../services/wishList.service';
import { IwhishListProduct } from '../../../Models/IwishListProduct';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IUser } from '../../../Models/iuser';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IProduct } from '../../../Models/iproduct';
import { ICart } from '../../../Models/icart';
import { ProductService } from '../../../services/product.service';
import { RouterLink } from '@angular/router';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';

@Component({
  selector: 'app-products-wish-list',
  standalone: true,
  imports: [RouterLink,CurrencyPipe,CommonModule,SecondarySpinnerComponent],
  templateUrl: './products-wish-list.component.html',
  styleUrl: './products-wish-list.component.scss'
})
export class ProductsWishListComponent implements OnInit {

  userLoggedID!:number;
  wishListProducts: IProduct[] = [];
  snackBarDurationInSeconds = 5;
   product!:IProduct;

   isProductsLoading:boolean=true;

  constructor(
    private wishListService: WishListService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private productService: ProductService

  ) {}


  ngOnInit(): void {
    this.isProductsLoading=true;
    this.userLoggedID=this.accountService.getTokenId();
    if(this.userLoggedID){
    this.loadWishList(this.userLoggedID);
    }
  }


  loadWishList(uerId:number): void {
    this.wishListService.getWishList(uerId!).subscribe(
      (data) => {
        this.wishListProducts = data;
        this.isProductsLoading=false;
      },
      (error) => {
        console.error('Error fetching wishlist:', error);
        this.isProductsLoading=false;
      }
    );
   
  }

  removeFromWishList(productId: number): void {
    this.wishListService.deleteWishListProduct(this.userLoggedID!, productId).subscribe(
      () => {
        // Remove the product from the local list
        this.loadWishList(this.userLoggedID!);
        this.wishListProducts = this.wishListProducts.filter((p) => p.productId !== productId);
      
      },
      (error) => {
        console.error('Error removing product from wishlist:', error);
      }
    );
  }
  removeFunc(productId: number): void {
    this.removeFromWishList(productId);
  }

  addToCart(product: IProduct): void {
    console.log(product);
    const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
    
    const existingProduct = (cart.productsAmounts.find(p => p.productId === product.productId));

    
    if (existingProduct) {
      

      if(this.isProductReachedMaxAmount(product)){
        this.snackBar.open('تم بلوغ الحد الأقصى للمنتج', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
        return;
      }


      existingProduct.amount += 1;
      this.snackBar.open('تم أضافة قطعة اخرى من المنتج إلى السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });

    } else {
      let newCartItme: IProduct = {
        productId:product.productId,
        amount:1,
        allAmount:product.amount,
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

    cart.finalPrice += (product.finalPrice);
    cart.numberOfProducts += 1;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
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
  isProductReachedMaxAmount(product:IProduct):boolean{
    const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
    const existingProduct = (cart.productsAmounts.find(p => p.productId === product.productId));
    if(existingProduct){
      return existingProduct.amount>=product.amount;
    }
    return false;
  }

  isProductInCart(productId:number){
    console.log(productId);

    const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
    console.log(cart)
    return cart.productsAmounts.some(p=>p.productId===productId);
  
  }

}