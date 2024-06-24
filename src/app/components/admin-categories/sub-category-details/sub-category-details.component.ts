import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ISubCategory } from '../../../Models/isub-category';
import { Subscription } from 'rxjs';
import { GenericService } from '../../../services/generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { AddSubcategoryComponent } from '../add-subcategory/add-subcategory.component';
import { DeleteSubcategoryComponent } from '../delete-subcategory/delete-subcategory.component';
import { AddSubCategoryValueComponent } from '../add-sub-category-value/add-sub-category-value.component';
import { ICategory } from '../../../Models/icategory';

@Component({
  selector: 'app-sub-category-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sub-category-details.component.html',
  styleUrl: './sub-category-details.component.scss'
})
export class SubCategoryDetailsComponent implements OnInit{
  subCategory!: ISubCategory;

  //subscription properties
  subscriptions: Subscription[] = [];
  //notifications properties
  notificationDurationInSeconds = 5;

  constructor(private genericService: GenericService<ISubCategory>,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadSubCategoryInfo();
  }

  private subCategoryDetailsObserver = {
    next: (data: ISubCategory) => {
      this.subCategory = data;
    },
    error: (error: any) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تحميل القسم الفرعى!',
        duration: this.notificationDurationInSeconds * 1000
      })
    }
  }

  loadSubCategoryInfo(): void {
    this.subscriptions.push(this.activatedRoute.paramMap.subscribe(params=>{
      let subCategoryId = Number(params.get('id'));
      if (!subCategoryId) {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'هذا القسم الفرعى غير موجود!',
          duration: this.notificationDurationInSeconds * 1000
        })
      } else {
        this.subscriptions.push(this.genericService.getById('subCategory', subCategoryId).subscribe(this.subCategoryDetailsObserver));
      }
    }))
  }

  editSubCategory(subCategoryId: number, subCategoryName: string) {
    console.log(subCategoryId);
    const dialogRef = this.dialog.open(AddSubcategoryComponent, {
      data: {subCategoryId, subCategoryName},
    });

    dialogRef.afterClosed().subscribe(data=>{
      if (data) {
        this.loadSubCategoryInfo();
      }
    })
  }

  confirmSubCategoryDelete(subCategoryId: number, subCategoryName: string) {
    const dialogRef = this.dialog.open(DeleteSubcategoryComponent, {
      data: {subCategoryId, subCategoryName},
    });

    dialogRef.afterClosed().subscribe(data=>{
      if (data) {
        this.router.navigate(['/admin-categories/subcategories-list']);
      }
    })
  }

  SubCategoryValueModal(subCategoryId:number, valueName?:string, valueImage?: string): void {
    const dialogRef = this.dialog.open(AddSubCategoryValueComponent, {
      data: {subCategoryId, valueName, valueImage},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.loadSubCategoryInfo();
      }
    });
  }
}
