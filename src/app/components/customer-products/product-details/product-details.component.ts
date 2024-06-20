import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../../Models/iproduct';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';


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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar // Add MatSnackBar here

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      this.fetchProductDetails(productId);
    });
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
}
