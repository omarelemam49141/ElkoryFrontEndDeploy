import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { IProduct } from '../../../Models/iproduct';
import { ICategory } from '../../../Models/icategory';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../services/file.service';
import { GenericService } from '../../../services/generic.service';
import { IProductCategorySubValues } from '../../../Models/iproduct-category-sub-values';
import { ICategorySubCategoriesValues } from '../../../Models/icategory-sub-categories-values';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';
import { IProductSubCategoryValues } from '../../../Models/iproduct-sub-category-values';
import { ISubCategoryCategoryValues } from '../../../Models/isub-category-category-values';
import { notMinusOneValidator } from '../../../custom-validators/notMinusOne';
import { discountIsLessThanFinalPrice } from '../../../custom-validators/discountLessThanFinalPrice';


@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, SecondarySpinnerComponent],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.scss'
})
export class AdminAddProductComponent implements OnDestroy, OnInit {
  /*start form properties*/
  productForm: FormGroup;
  allCategories: ICategory[] = [];
  subCategoriesAndValues?: ICategorySubCategoriesValues;

  /*start edit product properties*/
  productToEdit?: IProduct;

  /*images properties*/
  imageIndex: number = 0;
  imagesArray: string[] = [];
  originalImagesOfTheProductToUpdate: string[] = [];
  imagesToDeleteWhenUpdate: string[] = [];
  imagesToAddWhenUpdate: File[] = [];
  // QueryList to access file input elements
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  //spinners properties
  isProductAddingOrUpdating: boolean = false;

  //notifications properties
  snackBarDurationInSeconds = 5;

  //start subscription properties
  subscriptions?: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private genericService: GenericService<ICategory>,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      images: fb.array([
        ['', [Validators.required]]
      ], oneImageAtLeast),
      imagesToAdd: fb.array([]),
      discount: ['', [Validators.min(0)]],
      originalPrice: ['', [Validators.required, Validators.min(0)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      categoryId: ['-1', [Validators.required, CheckCategoryIsSelected]],
      subCategoriesWithValues: new FormArray([])
    }, {validators: discountIsLessThanFinalPrice()});
  }


  /*observers*/
  InsertNewImagesToProduct() {
    if (this.imagesToAdd.length > 0) {
      this.isProductAddingOrUpdating = true;
      this.productService.insertPictures(this.productToEdit!.productId, this.imagesToAdd.value).subscribe({
        next: data => {
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: 'تم تحديث المنتج بنجاح!',
            duration: this.snackBarDurationInSeconds * 1000
          });
          this.isProductAddingOrUpdating = false;
          this.populateEditForm();
        },
        error: (err: Error) => {
          this.snackBar.openFromComponent(FailedSnackbarComponent, {
            data: 'تعذر تحديث المنتج!',
            duration: this.snackBarDurationInSeconds * 1000
          });
          this.isProductAddingOrUpdating = false;
        }
      });
    } else {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: 'تم تحديث المنتج بنجاح!',
        duration: this.snackBarDurationInSeconds * 1000
      });
      this.isProductAddingOrUpdating = false;
    }
  }

  productsObserver = {
    next: (productData: any) => {
      if (!this.productToEdit) {
        this.isProductAddingOrUpdating = true;
        this.productService.insertPictures(productData.productId, this.images.value).subscribe({
          next: data => {
            this.isProductAddingOrUpdating = false;
            this.addAllSelectedSubCategoriesValuesToProduct(productData.productId);
          },
          error: (err: Error) => {
            this.isProductAddingOrUpdating = false;
            this.snackBar.openFromComponent(FailedSnackbarComponent, {
              data: 'تعذر اضافة المنتج!',
              duration: this.snackBarDurationInSeconds * 1000
            });
          }
        });
      } else {        //if there are images to update
        this.isProductAddingOrUpdating = false;
        if (this.imagesToDeleteWhenUpdate.length > 0) {
          //delete the old pictures
          this.imagesToDeleteWhenUpdate.forEach((image, index) => {
            this.isProductAddingOrUpdating = true;
            this.productService.deletePicture(this.productToEdit!.productId, image).subscribe(data => {
              if (this.imagesToDeleteWhenUpdate.length == index + 1) {
                this.isProductAddingOrUpdating = false;
                  this.InsertNewImagesToProduct();
              }
            });
          });
        //if there are no images to update
        } else {
          this.InsertNewImagesToProduct();
        }
      }
    },
    error: (err: Error) => {
      console.log(err);
      if (!this.productToEdit) {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'تعذر اضافة المنتج!',
        });
        this.isProductAddingOrUpdating = false;
      } else {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'تعذر تحديث المنتج!',
        });
        this.isProductAddingOrUpdating = false;
      }
    }
  }

  categoryObserver = {
    next: (data: ICategory[]) => {
      this.allCategories = data;
      this.isProductAddingOrUpdating = false;
    },
    error: (err: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تحميل الفئات!',
        duration: this.snackBarDurationInSeconds * 1000,
      });
      this.isProductAddingOrUpdating = false;
    }
  }

  ngOnInit(): void {
    this.isProductAddingOrUpdating = true;
    this.subscriptions?.push(this.genericService.getAll('category/all').subscribe(this.categoryObserver));
    this.populateEditForm();
  }

  addAllSelectedSubCategoriesValuesToProduct(productId: number) {
    //add the product sub categories values
    if (this.subCategoriesWithValues && this.subCategoriesWithValues.length > 0) {
      this.subCategoriesWithValues.controls.forEach((subCategoryGroup, index) => {
        let productCategorySubCategoryValue: IProductCategorySubValues 
        = this.mapSubCategoryValueFieldsToproductCategorySubCategoryValue(
          productId,
          this.productForm.get('categoryId')?.value,
          subCategoryGroup.get('selectedValue')?.value,
          +subCategoryGroup.get('subCategoryId')?.value
        )

        this.addSubCategoriesValueToProduct(productCategorySubCategoryValue, index);
      });
    } else {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: "تم إضافة المنتج بنجاح",
        duration: this.snackBarDurationInSeconds * 1000
      })
      this.router.navigate(["/admin-products"]);
    }
  }

  getAllSubCategoryValuesForTheSelectedCategoryAndPopulateThemToTheForm(subCategoryId: number, selectBoxFieldIndex: number) {
    this.isProductAddingOrUpdating = true;
    this.categoryService.getCategoriesWithValuesBySubCategoryId(subCategoryId).subscribe({
      next: (data:ISubCategoryCategoryValues) => {
        let categoryData = data.categories.find(cat=>cat.categoryId==+this.categoryId?.value);
        categoryData?.values.forEach(value => {
          (this.subCategoriesWithValues.controls[selectBoxFieldIndex].get("subCategoryValues") as FormArray).push(this.fb.control(value.value))
        })
        this.isProductAddingOrUpdating = false;
      },
      error: (err: Error) => {
        this.isProductAddingOrUpdating = false;
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'تعذر تحميل قيم الأقسام الفرعية!',
          duration: this.snackBarDurationInSeconds * 1000
        });
      }
    }) 
  }

  addSubCategoryValuesToEditForm(productSubCategoryValues: IProductSubCategoryValues, selectBoxFieldIndex: number) {
    this.getAllSubCategoryValuesForTheSelectedCategoryAndPopulateThemToTheForm(productSubCategoryValues.subCategoryId, selectBoxFieldIndex)
    return this.fb.group({
      subCategoryId: [productSubCategoryValues.subCategoryId, [Validators.required]],
      selectedValue: [productSubCategoryValues.values[0].value, [Validators.required, notMinusOneValidator()]],
      subCategoryName: [productSubCategoryValues.name, [Validators.required]],
      subCategoryValues: this.fb.array([])
    })
  }

  private populateSubCategoryValues() {
    if (this.productToEdit) {
      this.productToEdit.categoryValues?.forEach((categoryValue, index) => {
        this.subCategoriesWithValues?.push(this.addSubCategoryValuesToEditForm(categoryValue, index))
      })
    }
  }

  private populateEditForm() {
    //empty the new images to add when editing the product
    this.imagesToAdd.clear();
    //if the id in the url is not null then get the product by id
    this.subscriptions?.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        //get the product by id and patch the form with the product values
        this.subscriptions?.push(this.productService.getById(id).subscribe(product => {
          this.productToEdit = product;
          this.productForm.patchValue(this.productToEdit);
          //populate subCategory values
          this.populateSubCategoryValues()
          this.subscriptions?.push(this.productService.getPictures(id).subscribe(imagesUrls => {
            console.log(imagesUrls)
            if (imagesUrls.length > 0 && imagesUrls[0]) {
              this.imagesArray = imagesUrls;
              this.originalImagesOfTheProductToUpdate = this.imagesArray.slice();
              this.imageIndex = imagesUrls.length - 1;
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
            } else {
              this.productForm.get("images")?.setValue(this.fb.array([
                ['', [Validators.required]]
              ],  oneImageAtLeast));
            }
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
    this.imagesToDeleteWhenUpdate.push(this.imagesArray[index]);
    this.images.removeAt(index);
    this.imagesArray.splice(index, 1);
    this.imageIndex--;
    this.productForm.get("images")?.patchValue(this.imagesArray);
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
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          this.imagesArray[index] = e.target.result;
          //if the user changed an image that is existed in the original images array then add the original image to be deleted when updating the product
          if (this.imagesArray[index] == this.originalImagesOfTheProductToUpdate[index]) {
            this.imagesToDeleteWhenUpdate.push(this.imagesArray[index]);
          }
          this.images.at(index).patchValue(file);
          this.imagesToAdd.push(this.fb.control(file));
        };
      } else {
        // If the selected file is not an image, clear the file input
        input.value = ''; // Clear the file input
        this.imagesArray[index] = '';
      }
    }
  }

  addSubCategoriesToForm(subCategoriesAndValues: ICategorySubCategoriesValues) {
    this.subCategoriesWithValues.clear();
    subCategoriesAndValues.subCategories.forEach(subCategory => {
      this.subCategoriesWithValues.push(this.fb.group({
        subCategoryId: [subCategory.subCategoryId, [Validators.required]],
        selectedValue: ['-1', [Validators.required, notMinusOneValidator()]],
        subCategoryName: [subCategory.name, [Validators.required]],
        subCategoryValues: this.fb.array(subCategory.values.map(value => {
          return this.fb.control(value.value);
        })),
      }));
    })
  }

  getSubCategoryValues(subCategory: any): FormArray {
    return subCategory.get('subCategoryValues') as FormArray;
  }

  getSubCategoryFormGroup(index: number) : FormGroup {
    return this.subCategoriesWithValues.controls[index] as FormGroup;
  }

  displaySubCategories() {
    if (this.categoryId?.value == -1) {
      this.subCategoriesWithValues.clear();
      return
    }
    this.categoryService.getCategorySubCategoriesWithValues(this.categoryId?.value).subscribe({
      next: (data: ICategorySubCategoriesValues) => {
        this.isProductAddingOrUpdating = false;
        this.addSubCategoriesToForm(data);
      },
      error: (err: Error) => {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: "تعذر تحميل الأقسام الفرعية",
          duration: this.snackBarDurationInSeconds * 1000
        })
        this.isProductAddingOrUpdating = false;
      }
    })
  }
  /*end images functions*/

  mapSubCategoryValueFieldsToproductCategorySubCategoryValue(
    productId:number, 
    categoryId:number,
    subCategoryValue:string,
    subCategoryId: number): IProductCategorySubValues {
    let productCategorySubCategoryValue: IProductCategorySubValues = {
      productId: productId,
      subCategoryId: Number(subCategoryId),
      value: subCategoryValue,
      categoryId: Number(categoryId)
    }

    return productCategorySubCategoryValue;
  }

  addSubCategoriesValueToProduct(productCategorySubCategoryValue: IProductCategorySubValues, subCategoryValueIndex: number) {
    this.isProductAddingOrUpdating = true;
    this.categoryService.addProductCategorySubCategoryValue(productCategorySubCategoryValue).subscribe({
      next: () => {
        if (subCategoryValueIndex == this.subCategoriesWithValues.controls.length - 1) {
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: 'تم اضافة المنتج بنجاح!',
            duration: this.snackBarDurationInSeconds * 1000
          });

          this.router.navigate(["/admin-products"]);
        }
      },
      error: (err: Error) => {
        
        // console.log(err);
        // this.snackBar.openFromComponent(FailedSnackbarComponent, {
        //   data: "تعذر اضافة المنتج الى الأقسام الفرعية",
        //   duration: this.snackBarDurationInSeconds * 1000
        // })
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: 'تم اضافة المنتج بنجاح!',
          duration: this.snackBarDurationInSeconds * 1000
        });

        this.isProductAddingOrUpdating = false;
        this.router.navigate(["/admin-products"]);
      }
    })
  }

  /*submit the form*/
  submitProduct(): void {
    let product: IAddProduct = this.productForm.value;
    if (!product.discount) {
      product.discount = 0
    }
    this.isProductAddingOrUpdating = true;
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
  get imagesToAdd(): FormArray {
    return this.productForm.get("imagesToAdd") as FormArray;
  }

  get subCategoriesWithValues() {
    return this.productForm.get("subCategoriesWithValues") as FormArray;
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }
}
