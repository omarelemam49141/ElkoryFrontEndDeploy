import { Component, OnDestroy, OnInit } from '@angular/core';
import { GenericService } from '../../../services/generic.service';
import { ICategory } from '../../../Models/icategory';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDetailsComponent } from '../category-details/category-details.component';
import { DeleteCategoryComponent } from '../delete-category/delete-category.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnDestroy, OnInit{
  categories!: ICategory[];
  //subscriptions properties
  subscriptions: Subscription[] = [];
  //notifications properties
  notificationDurationInSeconds = 5;

  constructor(private genericService: GenericService<ICategory>,
              private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {
  }
  ngOnInit(): void {
    this.getAll();
  }

  public getAll(): void {
    this.subscriptions.push(this.genericService.getAll('category/all').subscribe({
      next: (data: ICategory[])=> {
        this.categories = data;
      },
      error: (err: Error) => {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: "تعذر تحميل الفئات",
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    }));
  }

  viewDetails(categoryName: string, categoryImage: string) {
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      data: {categoryName, categoryImage},
    });
  }

  confirmDelete(categoryId: number, categoryName: string) {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      data: {categoryId, categoryName},
    });

    dialogRef.afterClosed().subscribe(data=>{
      if (data) {
        this.getAll();
      }
    })
  }

  addNewCategory() {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      data: {}});

    dialogRef.afterClosed().subscribe(data=>{
      if (data) {
        this.getAll();
      }
    })
  }

  editCategory(categoryId: number, categoryName: string, categoryImage: string) {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      data: {categoryId, categoryName, categoryImage},
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
