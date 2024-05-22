import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { IProduct } from '../../../Models/iproduct';
import { ICategory } from '../../../Models/icategory';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { IAddProduct } from '../../../Models/iadd-product';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category.service';
import { CheckCategoryIsSelected } from '../../../custom-validators/checkCategoryIsSelcted';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { oneImageAtLeast } from '../../../custom-validators/oneImageAtLeast';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.scss'
})
export class AdminAddProductComponent implements OnDestroy, OnInit {
  productForm: FormGroup;
  allCategories: ICategory[] = [];
  subscriptions?: Subscription[];

  /*images properties*/
  imageIndex: number = 0;
  imagesArray: string[] = [];
  // QueryList to access file input elements
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  //notifications properties
  snackBarDurationInSeconds = 5;

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      images: fb.array([
        ['', [Validators.required]]
      ], oneImageAtLeast),
      discount: ['0', [Validators.max(100), Validators.min(0)]],
      originalPrice: ['', [Validators.required, Validators.min(0)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      categoryId: ['', [Validators.required, CheckCategoryIsSelected]],
    })
  }

  /*observers*/
  productsObserver = {
    next: (data: void) => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: 'تم اضافة المنتج بنجاح!',
      });
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر اضافة المنتج!',
      });
    }
  }

  categoryObserver = {
    next: (data: ICategory[]) => {
      this.allCategories = data;
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تحميل الفئات!',
        duration: this.snackBarDurationInSeconds * 1000,
      });
    }
  }


  ngOnInit(): void {
    this.categoryService.getAll().subscribe(this.categoryObserver)
  }
  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }

  /*start images function*/
  addImage(): void {
    if (this.images.at(this.imageIndex).value) {
      this.images.push(this.fb.control(['']));
      this.imageIndex++;
    }
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
    this.imagesArray.splice(index, 1);
    this.imageIndex--;
    // Clear the file input element
    const fileInput = this.fileInputs.toArray()[index].nativeElement;
    this.renderer.setProperty(fileInput, 'value', '');
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    
    // Check if any file is selected
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagesArray[index] = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        // If the selected file is not an image, clear the file input
        input.value = ''; // Clear the file input
      }
    }
  }
  /*end images functions*/

  /*submit the form*/ 
  addProduct(): void {
    let product: IAddProduct = this.productForm.value;
    this.productService.insert(product).subscribe(this.productsObserver);
  }
  /*end submitting the form*/
  get name() {
    return this.productForm.get("name");
  }
  get discount() {
    return this.productForm.get("discount");
  }
  get originalPrice() {
    return this.productForm.get("originalPrice");
  }
  get amount() {
    return this.productForm.get("amount");
  }
  get description() {
    return this.productForm.get("description");
  }
  get categoryId() {
    return this.productForm.get("categoryId");
  }

  get images(): FormArray {
    return this.productForm.get("images") as FormArray;
  }
}
