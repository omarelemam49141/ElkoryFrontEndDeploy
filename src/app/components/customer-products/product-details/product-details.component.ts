import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../../Models/iproduct';
//import currencyPipe from '@angular/common';
import { CurrencyPipe,CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: true,
  imports: [RouterLink,CommonModule,CurrencyPipe]
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: IProduct | undefined;
  relatedProducts: IProduct[] = [];
  subscriptions: Subscription[] = [];
  image: string | undefined;
  images: string[][] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private CategoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      this.fetchProductDetails(productId);
      
    });
  }

  fetchProductDetails(productId: number): void {
    const subscription = this.productService.getById(productId).subscribe({
      next: (product: IProduct) => {this.product = product
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
      const subscription = this.CategoryService.getCategoryProducts(this.product.categoryId).subscribe({
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
}
