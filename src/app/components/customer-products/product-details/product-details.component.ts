import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../../Models/iproduct';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { IwhishListProduct } from '../../../Models/IwishListProduct';
import { WishListService } from '../../../services/wishList.service';
import { IUser } from '../../../Models/iuser';
import { IAddWishListProduct } from '../../../Models/Iadd-wishListproduct';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe,FormsModule],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: IProduct | undefined;
  relatedProducts: IProduct[] = [];
  subscriptions: Subscription[] = [];
  image: string | undefined;
  images: string[][] = [];
  quantity: number = 1; // Initialize quantity to 1
  wishList:IwhishListProduct [] = [];
  user: IUser = {
    userId: 3,
    fName: 'Ahmad',
    lName: 'Esam',
    email: 'ahmad.esam@ex.com',
    phone: '1015328933',
    governorate: 'Ghatbia',
    city: 'MAhalla',
    street: 'Farouk21',
    postalCode: '12345',
    password: '12345',
    isDeleted: false,
    role: 1
  };
  
  snackBarDurationInSeconds = 5;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar, // Add MatSnackBar here
    private wishListService:WishListService


  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      this.fetchProductDetails(productId);
    });
    this.fetchWishList(this.user.userId);
  }

  fetchProductDetails(productId: number): void {
    const subscription = this.productService.getById(productId).subscribe({
      next: (product: IProduct) => {
        this.product = product;
        this.productService.getPictures(product.productId).subscribe((images: string[]) => {
          this.image = images[0];
        });
        this.fetchRelatedProducts();
      },
      error: (err: any) => console.error('Error fetching product details:', err)
    });
    this.subscriptions.push(subscription);
  }

  fetchRelatedProducts(): void {
    if (this.product?.categoryId) {
      const subscription = this.categoryService.getCategoryProducts(this.product.categoryId).subscribe({
        next: (products: IProduct[]) => {
          this.relatedProducts = products.slice(0, 4);
          for (let i = 0; i < this.relatedProducts.length; i++) {
            this.productService.getPictures(this.relatedProducts[i].productId).subscribe({
              next: (images: string[]) => this.images[i] = images,
              error: (err: any) => console.error('Error fetching product images:', err)
            });
          }
        },
        error: (err: any) => console.error('Error fetching related products:', err)
      });
      this.subscriptions.push(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
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
  addToCart(product: IProduct): void {
    // Implement your logic to add to cart using this.quantity
    const cart: any = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
    
    const existingProduct = cart.productsAmounts.find((p: any) => p.productId === product.productId);
    if (existingProduct) {
      existingProduct.amount += this.quantity;
    } else {
      product.amount = this.quantity;
      cart.productsAmounts.push(product);
      cart.numberOfUniqueProducts += 1;
    }

    cart.finalPrice += product.finalPrice * this.quantity;
    cart.numberOfProducts += this.quantity;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    // Reset quantity after adding to cart
    this.quantity = 1;

    // Provide feedback to the user
    const snackBarDurationInSeconds = 5;
    this.snackBar.open('تم إضافة المنتج إلى السلة', 'إغلاق', { duration: snackBarDurationInSeconds * 1500 });
  }

  addProductToWishList(item:IAddWishListProduct)
  {
    this.wishListService.addWishListProduct(item).subscribe(
      ()=>{
        console.log("from success section")
        this.snackBar.open('تم إضافة المنتج إلى القائمة المفضلة ', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
        this.fetchWishList(this.user.userId);
      },
      (error)=>{
        console.log("error section")
        console.log(error);
        this.snackBar.open('حدث خطأ أثناء إضافة المنتج إلى  القائمة المفضلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
      }
    );
  }
  
  isProductInWishlist(productId:number):boolean{
    if(!this.wishList){
      return false;
    }
    return this.wishList.some(p=>p.productId===productId);
  }
  removeFromWishList(wishListProduct: { userId: number, productId: number }): void {
    this.wishListService.deleteWishListProduct(wishListProduct.userId, wishListProduct.productId).subscribe(
      () => {
        this.fetchWishList(this.user.userId);
        this.snackBar.open('تم حذف المنتج من القائمة المفضلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 })
      },
      (error) => {
        console.error('Error removing product from wishlist:', error);
        this.snackBar.open('حدث خطأ أثناء حذف المنتج من القائمة المفضلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });
      }
    );
  }
}
