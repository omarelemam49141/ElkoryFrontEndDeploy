import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, output } from '@angular/core';
import { IProduct } from '../../../../Models/iproduct';
import { ProductService } from '../../../../services/product.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IOfferProduct } from '../../../../Models/ioffer-product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnChanges, OnInit{
  //start input properties
  @Input() product!: IProduct;
  @Input() offerId!: number;
  @Input() editProduct!: boolean;

  //start output properties
  @Output() productAddedToOffer: EventEmitter<IOfferProduct>;

  //product properties
  productImage!:string;

  //form properties
  addProductForm!: FormGroup;

  constructor(private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productAddedToOffer = new EventEmitter<IOfferProduct>();
  }
  ngOnInit(): void {
    this.addProductForm = this.fb.group({
      productId: [this.product.productId, [Validators.required]],
      name: [this.product.name, [Validators.required]],
      image: [this.productImage, [Validators.required]],
      productAmount: [1, [Validators.required, Validators.min(1)]],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    })

    //get the product pictures
    this.productService.getPictures(this.product.productId).subscribe({
      next: (images: string[]) => {
        if (images.length > 0) {
          this.productImage = images[0];
        } else {
          this.productImage = 'assets/images/no-image.png';
        }        
      },
      error: (err: Error) => {
        this.productImage = 'assets/images/no-image.png';
      }
    })
  }

  ngOnChanges(): void {
    
  }

  addProductToOffer() {
    let offerProduct: IOfferProduct = {
      productId: this.product.productId,
      productAmount: this.addProductForm.value.productAmount,
      discount: this.addProductForm.value.discount,
      name: this.addProductForm.value.name,
      image: this.productImage
    }

    this.productAddedToOffer.emit(offerProduct);
  }

}
