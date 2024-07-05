import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { IProduct } from '../../../Models/iproduct';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WishListService } from '../../../services/wishList.service';
import { CartService } from '../../../services/cart.service';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';
import { IAddWishListProduct } from '../../../Models/Iadd-wishListproduct';
import { OffersSliderComponent } from '../../main-components/offers-slider/offers-slider.component';

import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { ICart } from '../../../Models/icart';


@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [RouterLink,
    CurrencyPipe,
    MatPaginatorModule,
    CommonModule,
    FormsModule, 
    SecondarySpinnerComponent],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.scss'
})
export class CategoryProductsComponent implements OnInit ,OnDestroy, OnChanges
 {
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
  isProductsLoading = true;

  subscriptions?: Subscription[];
//temp user
userLoggedID!:number;

wishList?:IProduct[];
 categoryId=0;
 subCategoryID=0;
  value="";

constructor(private productService: ProductService,
  private snackBar: MatSnackBar,
  private wishListService:WishListService,
  private cartService: CartService,
  private accountService: AccountService,
  private route: ActivatedRoute,){}






  ngOnInit(): void {

this.route.paramMap.subscribe(

  param=>{
    //    {path:"Subcategory-value-products/:categoryID/:subCategoryID/:value",component:ProductsListComponent},

    this.categoryId=Number(param.get('categoryID'));
      this.subCategoryID=Number(param.get('subCategoryID'));
     this.value=(param.get('value'))+'';

     console.log(this.categoryId)
      console.log(this.subCategoryID)
      console.log(this.value)
      this.fetchproductsInSucategoryValue(this.categoryId,this.subCategoryID,this.value);

  }
  
)





this.userLoggedID=this.accountService.getTokenId();
if(this.userLoggedID){  
    this.fetchWishList(this.userLoggedID);
  
}



  }



  ngOnChanges(changes: SimpleChanges): void {
    this.route.paramMap.subscribe(

      param=>{
        //    {path:"Subcategory-value-products/:categoryID/:subCategoryID/:value",component:ProductsListComponent},
    
        this.categoryId=Number(param.get('categoryID'));
          this.subCategoryID=Number(param.get('subCategoryID'));
         this.value=(param.get('value'))+'';
    
      }
    )

      this.fetchproductsInSucategoryValue(this.categoryId,this.subCategoryID,this.value);
    
    
    
    console.log(this.categoryId)
    console.log(this.subCategoryID)
    console.log(this.value)
    
    
    this.userLoggedID=this.accountService.getTokenId();
    if(this.userLoggedID){  
        this.fetchWishList(this.userLoggedID);
      
    }
  }
fetchproductsInSucategoryValue(categoryId:number,subCategoryID:number,value:string){
const subscription=  this.productService.getproductsbycategorySubcategoryValue(categoryId,subCategoryID,value).subscribe({
  next: (products: IProduct[]) => {
    console.log(products);
    this.products = products;

    for(let i=0;i<this.products.length;i++){
      this.quantity.push(1);
    }
    // this.getProductsPaginated(this.pageNumber,this.pageSize);
    this.isProductsLoading = false;

  },
  error: (err: any) => {console.error('Error fetching products:', err);
    this.isProductsLoading = false;

  }
  })
  this.subscriptions?.push(subscription);
}

  getDiscountPercentage(originalPrice: number, finalPrice: number): number {
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
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


  isProductInWishlist(productId:number):boolean{
    if(!this.wishList){
      return false;
    }
    return this.wishList.some(p=>p.productId===productId);
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




modifyCartAndAddItToLocalStorage(cart: ICart, product: IProduct,locationInlist:number) {
  cart.finalPrice += (product.finalPrice* this.quantity[locationInlist]);
  cart.numberOfProducts += this.quantity[locationInlist];

  
  localStorage.setItem('cart', JSON.stringify(cart));

  this.cartService.changeNumberOfItemsInCart(cart.numberOfUniqueProducts);

  return cart;
}

isProductInCart(productId:number){
  const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
  return cart.productsAmounts?.some(p=>p.productId===productId);

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

increaseQuantity(index:number): void {
  
  if (this.quantity[index] < this.products[index].amount) {
    this.quantity[index]++;
  }
  else {
    this.snackBar.open('لا يوجد كمية كافية في المخزون', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
  }
}

decreaseQuantity(index:number): void {

  if (this.quantity[index] > 1) {
    this.quantity[index]--;
  }
}




validateSelectedProductAmount(index:number){ 
  if( this.quantity[index]< 1){
    this.quantity[index] = 1;
    return 
  }
  else if(this.quantity[index] > this.products[index].amount){
    this.quantity[index] = this.products[index].amount;
    return 
  }
}

isProductReachedMaxAmount(product:IProduct):boolean{
  const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
  const existingProduct = (cart.productsAmounts?.find(p => p.productId === product.productId));
  if(existingProduct){
    return existingProduct.amount>=product.amount;
  }
  return false;
}


ngOnDestroy(): void {
this.subscriptions?.forEach(sub => sub.unsubscribe());}


getProductsPaginated(pageNumber:number, pageSize:number): void {
  this.isProductsLoading = true;
this.pageNumber=pageNumber
this.pageSize=pageSize
console.log(this.sortingOption)
console.log(this.pageNumber);
console.log(this.pageSize);
if(this.sortingOption=="all"){

 
    this.fetchproductsInSucategoryValue(this.categoryId,this.subCategoryID,this.value);
    this.products=this.products.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  
}
else if(this.sortingOption=="price_des"){
  //sort the products desending by price 
  
  this.products=this.products.sort((a,b)=>b.finalPrice-a.finalPrice).slice(this.pageNumber * this.pageSize, (this.pageNumber + 1) * this.pageSize);
  console.log(this.products)

}
else if(this.sortingOption=="price_asc"){
  //sort the products desending by price 
  
  this.products=this.products.sort((a,b)=>a.finalPrice-b.finalPrice).slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);

}
else if(this.sortingOption=="amount_des"){
  //sort the products desending by price 
  
  this.products=this.products.sort((a,b)=>b.amount-a.amount).slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
}
else if(this.sortingOption=="amount_asc"){
  //sort the products desending by price 
  
  this.products=this.products.sort((a,b)=>a.amount-b.amount).slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
 }
 else if(this.sortingOption=="discount_des"){
  //sort the products desending by price 
  
  this.products=this.products.sort((a,b)=>b.discount-a.discount).slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
}
  
    else if(this.sortingOption=="discount_asc"){
      //sort the products desending by price 
      
      this.products=this.products.sort((a,b)=>a.discount-b.discount).slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
    }
}
 }