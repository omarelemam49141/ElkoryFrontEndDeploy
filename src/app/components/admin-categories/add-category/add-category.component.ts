import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GenericService } from '../../../services/generic.service';
import { ICategory } from '../../../Models/icategory';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FileService } from '../../../services/file.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-add-category',
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
    CommonModule
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnDestroy, OnInit{
  //form properties
  categoryForm!: FormGroup;
  selectedImage: string = '';

  //Category to edit properties
  categoryToEdit?: ICategory;

  //notification properties
  notificationDurationInSeconds = 5;

  //subscriptions properties
  subscriptions: Subscription[] = [];

  constructor(private genericService: GenericService<ICategory>,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {categoryId?: number, categoryName?: string, categoryImage?: string},
    private snackBar: MatSnackBar,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {    
    this.categoryForm = fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      Image: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
      if (this.data?.categoryId) {
        //populate the form with the category image
        this.setCategoryImage();
        //populate the form with the category name
        this.categoryForm.get('name')?.setValue(this.data.categoryName);
      }
    })
  }

  setCategoryImage() {
    if (this.data?.categoryImage) {
      this.selectedImage = this.data.categoryImage;
      console.log(this.data.categoryId);
      //get the image name feom its url
      let imageName = this.data.categoryImage.split('/').pop()!;
      let mimeType = this.data.categoryImage.split(';')[0].split(':')[1];
      this.fileService.urlToFile(this.data.categoryImage, imageName, mimeType).then((file) => {
        this.categoryForm.get('Image')?.setValue(file);
      })
    }
  }

  addCategoryObserver = {
    next: () => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: "تم اضافة القسم بنجاح!",
        duration: this.notificationDurationInSeconds * 1000
      })
      this.dialogRef.close(true);
    },
    error: (e: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "تعذر اضافة القسم!",
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  updateCategoryObserver = {
    next: () => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: "تم تعديل القسم بنجاح!",
        duration: this.notificationDurationInSeconds * 1000
      })
      this.dialogRef.close(true);
    },
    error: (e: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "تعذر تعديل القسم!",
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  convertFormToFormData() {
    let formData: FormData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value);
    formData.append('image', this.categoryForm.get('Image')?.value);
    return formData;
  }

  updateCategory(formData: FormData) {
    formData.append('id', this.data.categoryId!.toString());
    this.subscriptions.push(this.http.put(`${environment.apiUrl}/category?id=${this.data.categoryId}`, formData, this.genericService.httpOptions).subscribe(this.updateCategoryObserver));
  }

  addCategory(formData: FormData) {
    this.subscriptions.push(this.genericService.insert('category', formData).subscribe(this.addCategoryObserver));
  }

  public submitCategory() {
    //convert the form to dorm data
    let formData: FormData = this.convertFormToFormData();

    if (this.categoryForm.valid) {
      if (this.data?.categoryId) {
        //update the category
        this.updateCategory(formData);
      } else {
        //add new category
        this.addCategory(formData);
      }
    }
  }

  onFileSelected(event: any): void {
    //convert the file to binary
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = event.target.files[0];
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        this.categoryForm.get("Image")?.setValue(file);
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  get name() { return this.categoryForm.get('name'); }
  get image() { return this.categoryForm.get('Image'); }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
