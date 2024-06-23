import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductCardComponent } from '../../admin-offers/add-offer-product/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../../../Models/icategory';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { GenericService } from '../../../services/generic.service';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { ISubCategoryValue } from '../../../Models/isub-category-value';
import { CategoryService } from '../../../services/category.service';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-add-sub-category-value',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    ProductCardComponent,
    CommonModule],
  templateUrl: './add-sub-category-value.component.html',
  styleUrl: './add-sub-category-value.component.scss'
})
export class AddSubCategoryValueComponent implements OnInit, OnDestroy{
  allCategories: ICategory[] = [];

  //edit form properties
  selectedImage: string = '';

  //form properties
  subCategoryValueForm!: FormGroup;

  //notifications properties
  notificationDurationInSeconds = 5;

  //subscriptions properties
  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddSubCategoryValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {subCategoryId: number, subCategoryName:string, categoryId?: number, valueName?: string, valueImage?: string},
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private categoryGenericService: GenericService<ICategory>,
    private categoryService: CategoryService,
    private fileService: FileService
  ) {
    this.subCategoryValueForm = this.fb.group({
      subCategoryId: [this.data.subCategoryId, [Validators.required]],
      categoryId: [this.data.categoryId??'', [Validators.required]],
      value: [this.data.valueName??'', [Validators.required, Validators.min(2)]],
      image: [this.data.valueImage??'', [Validators.required]],
    })
  }

  private allCategoriesObserver = {
    next: (data: ICategory[]) => {
      this.allCategories = data;
    },
    error: (error: any) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تحميل الأقسام الرئيسية!',
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  ngOnInit(): void {
    this.loadAllCategories();
    this.activatedRoute.paramMap.subscribe(params => {
      this.populateFormData();
    })
  }

  populateNonImageData() {
    this.subCategoryValueForm.patchValue({
      categoryId: this.data.categoryId,
      value: this.data.valueName,
    })
  }

  populateImage() {
    if (this.data.valueImage) {
      //get the image name feom its url
      let imageName = this.data.valueImage.split('/').pop()!;
      let mimeType = this.data.valueImage.split(';')[0].split(':')[1];
      this.fileService.urlToFile(this.data.valueImage, imageName, mimeType).then((file) => {
        this.subCategoryValueForm.get("image")?.setValue(file);
        this.selectedImage = this.data.valueImage!;
      })
    }
  }
  
  populateFormData(): void {
    //populate the form with all data except the image
    this.populateNonImageData();
    //populate the form with the image
    this.populateImage();
  }

  loadAllCategories(): void {
    this.subscriptions.push(this.categoryGenericService.getAll('category/all').subscribe(this.allCategoriesObserver));
  }

  onFileSelected(event: any): void {
    //convert the file to binary
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = event.target.files[0];
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        this.subCategoryValueForm.get("Image")?.setValue(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result;
        };
      } else {
        // If the selected file is not an image, clear the file input
        input.value = ''; // Clear the file input
        this.selectedImage = '';
      }
    }
  }

  updateValue(subCategoyValueModel: ISubCategoryValue) {
    if (this.subCategoryValueForm.valid) {
      this.subscriptions.push(this.categoryService.updateSubCategoryValue(subCategoyValueModel).subscribe({
        next: () => {
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: 'تم تحديث القيمة بنجاح!',
            duration: this.notificationDurationInSeconds * 1000
          })
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.openFromComponent(FailedSnackbarComponent, {
            data: 'تعذر تحديث القيمة!',
            duration: this.notificationDurationInSeconds * 1000
          })
        }
      }))
    }
  }

  addNewValue(subCategoyValueModel: ISubCategoryValue) {
    if (this.subCategoryValueForm.valid) {
      this.subscriptions.push(this.categoryService.addSubCategoryValue(subCategoyValueModel).subscribe({
        next: () => {
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: 'تم اضافة القيمة بنجاح!',
            duration: this.notificationDurationInSeconds * 1000
          })
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.openFromComponent(FailedSnackbarComponent, {
            data: 'تعذر اضافة القيمة!',
            duration: this.notificationDurationInSeconds * 1000
          })
        }
      }))
    }
  }

  submitForm() {
    let subCategoyValueModel = this.subCategoryValueForm.value as ISubCategoryValue; 
    if (this.data.categoryId) {
      this.updateValue(subCategoyValueModel);
    }
    else
    {
      this.addNewValue(subCategoyValueModel);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get categoryId() {
    return this.subCategoryValueForm.get("categoryId");
  }
  get value() {
    return this.subCategoryValueForm.get("categoryId");
  }
  get image() {
    return this.subCategoryValueForm.get("image");
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
