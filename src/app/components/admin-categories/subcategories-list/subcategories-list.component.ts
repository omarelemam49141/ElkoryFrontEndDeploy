import { Component } from '@angular/core';
import { ISubCategory } from '../../../Models/isub-category';
import { Subscription } from 'rxjs';
import { GenericService } from '../../../services/generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { DeleteSubcategoryComponent } from '../delete-subcategory/delete-subcategory.component';
import { AddSubcategoryComponent } from '../add-subcategory/add-subcategory.component';
import { RouterLink } from '@angular/router';
import { SecondarySpinnerComponent } from '../../secondary-spinner/secondary-spinner.component';

@Component({
  selector: 'app-subcategories-list',
  standalone: true,
  imports: [RouterLink, SecondarySpinnerComponent],
  templateUrl: './subcategories-list.component.html',
  styleUrl: './subcategories-list.component.scss'
})
export class SubcategoriesListComponent {
  subCategories!: ISubCategory[];
  //subscriptions properties
  subscriptions: Subscription[] = [];
  //notifications properties
  notificationDurationInSeconds = 5;

  //spinner properties
  isSubCategoriesLoading: boolean = false;

  constructor(private genericService: GenericService<ISubCategory>,
              private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {
  }
  ngOnInit(): void {
    this.getAll();
  }

  public getAll(): void {
    this.isSubCategoriesLoading = true;
    this.subscriptions.push(this.genericService.getAll('subCategory/all').subscribe({
      next: (data: ISubCategory[])=> {
        this.isSubCategoriesLoading = false;
        this.subCategories = data;
      },
      error: (err: Error) => {
        this.isSubCategoriesLoading = false;
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: "تعذر تحميل الفئات",
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    }));
  }

  // viewDetails(categoryName: string, categoryImage: string) {
  //   const dialogRef = this.dialog.open(CategoryDetailsComponent, {
  //     data: {categoryName, categoryImage},
  //   });
  // }

  confirmDelete(subCategoryId: number, subCategoryName: string) {
    const dialogRef = this.dialog.open(DeleteSubcategoryComponent, {
      data: {subCategoryId, subCategoryName},
    });

    dialogRef.afterClosed().subscribe(data=>{
      if (data) {
        this.getAll();
      }
    })
  }

  addNewSubCategory() {
    const dialogRef = this.dialog.open(AddSubcategoryComponent, {
      data: {}});

    dialogRef.afterClosed().subscribe(data=>{
      if (data) {
        this.getAll();
      }
    })
  }

  editSubCategory(subCategoryId: number, subCategoryName: string) {
    console.log(subCategoryId);
    const dialogRef = this.dialog.open(AddSubcategoryComponent, {
      data: {subCategoryId, subCategoryName},
    });

    dialogRef.afterClosed().subscribe(data=>{
      if (data) {
        this.getAll();
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
}
