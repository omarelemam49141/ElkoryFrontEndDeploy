import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ISubCategory } from '../../../Models/isub-category';
import { Subscription } from 'rxjs';
import { GenericService } from '../../../services/generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-add-subcategory',
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
    CommonModule],
  templateUrl: './add-subcategory.component.html',
  styleUrl: './add-subcategory.component.scss'
})
export class AddSubcategoryComponent implements OnInit{
  //form properties
  subCategoryForm!: FormGroup;

  //Category to edit properties
  subCategoryToEdit?: ISubCategory;

  //notification properties
  notificationDurationInSeconds = 5;

  //subscriptions properties
  subscriptions: Subscription[] = [];

  constructor(private genericService: GenericService<ISubCategory>,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSubcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {subCategoryId?: number, subCategoryName?: string},
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {    
    this.subCategoryForm = fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    })
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
      if (this.data?.subCategoryId) {
        console.log(this.data)
        //populate the form with the category name
        this.subCategoryForm.get('name')?.setValue(this.data.subCategoryName);
      }
    })
  }

  addSubCategoryObserver = {
    next: () => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: "تم اضافة القسم الفرعى بنجاح!",
        duration: this.notificationDurationInSeconds * 1000
      })
      this.dialogRef.close(true);
    },
    error: (e: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "تعذر اضافة القسم الفرعى!",
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  updateSubCategoryObserver = {
    next: () => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: "تم تعديل القسم الفرعى بنجاح!",
        duration: this.notificationDurationInSeconds * 1000
      })
      this.dialogRef.close(true);
    },
    error: (e: Error) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: "تعذر تعديل القسم الفرعى!",
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  updateSubCategory(subCategoryModel: ISubCategory) {
    this.subscriptions.push(this.http.put(`${environment.apiUrl}/subCategory?id=${this.data.subCategoryId}`, subCategoryModel, this.genericService.httpOptions).subscribe(this.updateSubCategoryObserver));
  }

  addSubCategory(subCategoryModel: ISubCategory) {
    this.subscriptions.push(this.genericService.insert('subCategory', subCategoryModel).subscribe(this.addSubCategoryObserver));
  }

  public submitSubCategory() {
    let subCategoryModel: ISubCategory = this.subCategoryForm.value as ISubCategory; 
    if (this.subCategoryForm.valid) {
      if (this.data?.subCategoryId) {
        //update the category
        this.updateSubCategory(subCategoryModel);
      } else {
        //add new category
        this.addSubCategory(subCategoryModel);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get name() { return this.subCategoryForm.get('name'); }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
