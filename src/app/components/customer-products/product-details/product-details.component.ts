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
import { ICart } from '../../../Models/icart';


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
    password: '123',
    phone: "1015328933",
    governorate: 'Ghatbia',
    city: 'MAhalla',
    street: 'Farouk21',
    postalCode: "12345",
    isDeleted: false,
    role: 1
  };
  
  snackBarDurationInSeconds = 5;
  // isProductInCart: boolean = false; // Track if the product is in the cart


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
    this.fetchWishList(this.user.userId!);
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
          this.relatedProducts = this.getRandomSubset(products, 4);          
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

  getRandomSubset(array: any[], size: number): any[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, size);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.amount) {
      this.quantity++;
    } else {
      this.snackBar.open('لا يوجد كمية كافية في المخزون', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  fetchWishList(UserId:number) {
    this.wishListService.getWishList(UserId).subscribe(
      (data) => {
        console.log("from success section")
        console.log(data);
        this.wishList = data;
      },
      (error) => {
        console.log("error section")
        console.log(error);
      }
    );
  }

  addToCart(product: IProduct): void {
    const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
    
    const existingProduct = (cart.productsAmounts.find(p => p.productId === product.productId));
    console.log( `the product from cart is ${existingProduct?.amount}`);
      console.log(`the product from product list ${product.amount}`)
    
    if (existingProduct) {
      

     


      existingProduct.amount += this.quantity;
      this.snackBar.open('تم أضافة قطعة اخرى من المنتج إلى السلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 });

    } else {
      let newCartItme={
        productId:product.productId,
        amount:this.quantity,
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

    cart.finalPrice +=( product.finalPrice* this.quantity);
    cart.numberOfProducts += this.quantity;
    
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

  addProductToWishList(item:IAddWishListProduct) {
    this.wishListService.addWishListProduct(item).subscribe(
      () => {
        console.log("from success section")
        this.snackBar.open('تم إضافة المنتج إلى القائمة المفضلة ', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
        this.fetchWishList(this.user.userId!);

      },
      (error) => {
        console.log("error section")
        console.log(error);
        this.snackBar.open('حدث خطأ أثناء إضافة المنتج إلى  القائمة المفضلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
      }
    );
  }

  isProductInWishlist(productId:number):boolean {
    if(!this.wishList) {
      return false;
    }
    return this.wishList.some(p => p.productId === productId);
  }

  removeFromWishList(wishListProduct: { userId: number, productId: number }): void {
    this.wishListService.deleteWishListProduct(wishListProduct.userId, wishListProduct.productId).subscribe(
      () => {

        this.fetchWishList(this.user.userId!);
        this.snackBar.open('تم حذف المنتج من القائمة المفضلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1500 })
      },
      (error) => {
        console.error('Error removing product from wishlist:', error);
        this.snackBar.open('حدث خطأ أثناء حذف المنتج من القائمة المفضلة', 'إغلاق', { duration: this.snackBarDurationInSeconds * 1000 });
      }
    );
  }

  getDiscountPercentage(originalPrice: number, finalPrice: number): number {
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }

  isProductInCart(productId:number){
    const cart: ICart = JSON.parse(localStorage.getItem('cart') || '{"userId": null, "productsAmounts": [], "finalPrice": 0, "numberOfUniqueProducts": 0, "numberOfProducts": 0}');
    return cart.productsAmounts.some(p=>p.productId===productId);
  
  }
}
