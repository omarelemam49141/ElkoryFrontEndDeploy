import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { IProduct } from '../../../Models/iproduct';
import { ICategory } from '../../../Models/icategory';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../services/file.service';


@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.scss'
})
export class AdminAddProductComponent implements OnDestroy, OnInit {
  /*start form properties*/
  productForm: FormGroup;
  allCategories: ICategory[] = [];
  
  /*start edit product properties*/
  productToEdit?: IProduct;

  /*images properties*/
  imageIndex: number = 0;
  imagesArray: string[] = [];
  originalImagesOfTheProductToUpdate: string[] = [];
  imagesToDeleteWhenUpdate: string[] = [];
  // QueryList to access file input elements
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  //notifications properties
  snackBarDurationInSeconds = 5;

  //start subscription properties
  subscriptions?: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
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
    next: (data: any) => {
      if(!this.productToEdit) {
        console.log(this.images.value);
        this.productService.insertPictures(data.productId, this.images.value).subscribe({
          next: data => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: 'تم اضافة المنتج بنجاح!',
              duration: this.snackBarDurationInSeconds * 1000
            });
            this.productForm.reset();
            this.imagesArray = [];
            this.imageIndex = 0;
          },
          error: (err:Error) => {
            this.snackBar.openFromComponent(FailedSnackbarComponent, {
              data: 'تعذر اضافة المنتج!',
              duration: this.snackBarDurationInSeconds * 1000
            });
          }
        });
        
      } else {
        //delete the old pictures
        this.imagesToDeleteWhenUpdate.forEach((image, index) => {
          this.productService.deletePicture(this.productToEdit!.productId, image).subscribe(data=>{
            if (this.imagesToDeleteWhenUpdate.length-1 == index) {
              this.productService.insertPictures(this.productToEdit!.productId, this.images.value).subscribe({
                next: data => {
                  this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                    data: 'تم تحديث المنتج بنجاح!',
                    duration: this.snackBarDurationInSeconds * 1000
                  });
                  this.populateEditForm();
                },
                error: (err:Error) => {
                  this.snackBar.openFromComponent(FailedSnackbarComponent, {
                    data: 'تعذر تحديث المنتج!',
                    duration: this.snackBarDurationInSeconds * 1000
                  });
                }
              });
            }
          });
        });
      }
    },
    error: (err: Error) => {
      if(!this.productToEdit) {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
            data: 'تعذر اضافة المنتج!',
        });
      } else {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'تعذر تحديث المنتج!',
        });
      }
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
    this.subscriptions?.push(this.categoryService.getAll().subscribe(this.categoryObserver));
    this.populateEditForm();
  }

  private populateEditForm() {
    //if the id in the url is not null then get the product by id
    this.subscriptions?.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        //get the product by id and patch the form with the product values
        this.subscriptions?.push(this.productService.getById(id).subscribe(product => {
          this.productToEdit = product;
          this.productForm.patchValue(this.productToEdit);
          this.subscriptions?.push(this.productService.getPictures(id).subscribe(imagesUrls => {
            this.imagesArray = imagesUrls;
            this.originalImagesOfTheProductToUpdate = this.imagesArray.slice();
            this.imageIndex = imagesUrls.length-1;
            //patch the form images with the images
            //empty the images array control
            this.images.clear();

            const filePromises = imagesUrls.map(imageUrl => {
              const imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
              const extension = imageUrl.substring(imageUrl.lastIndexOf(".") + 1);
              const mimeType = `image/${extension}`;
  
              return this.fileService.urlToFile(imageUrl, imageName, mimeType);
            });
            Promise.all(filePromises).then(files => {
              files.forEach(file => {
                this.images.push(this.fb.control(file));
              });
            }).catch(error => {
              console.error('Error processing images:', error);
            });
          }));
        }));
      }
    }))
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
    this.imagesArray[index] = '';
    this.imageIndex--;
    // Clear the file input element
    const fileInput = this.fileInputs.toArray()[index].nativeElement;
    this.renderer.setProperty(fileInput, 'value', '');
  }

  fun() {
    console.log("lkjhgfd")
  }

  onFileChange(event: Event, index: number): void {
    //if the user changed an image that is existed in the original images array then add the original image to be deleted when updating the product
    if (this.imagesArray[index] == this.originalImagesOfTheProductToUpdate[index]) {
      this.imagesToDeleteWhenUpdate.push(this.imagesArray[index]);
    }

    const input = event.target as HTMLInputElement;
    
    // Check if any file is selected
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          this.imagesArray[index] = e.target.result;
          this.images.at(index).patchValue(file);
        };
      } else {
        // If the selected file is not an image, clear the file input
        input.value = ''; // Clear the file input
        this.imagesArray[index] = '';
      }
    }

   console.log(this.imageIndex) 
   console.log(this.images.value)
   console.log(this.imagesArray)
  }
  /*end images functions*/

  /*submit the form*/ 
  submitProduct(): void {
    let product: IAddProduct = this.productForm.value;
    if (this.productToEdit) {
      this.subscriptions?.push(this.productService.update(this.productToEdit.productId, product).subscribe(this.productsObserver));
    } else {
      this.subscriptions?.push(this.productService.insert(product).subscribe(this.productsObserver));
    }
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

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }
}
