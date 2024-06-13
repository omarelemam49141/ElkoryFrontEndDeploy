import { Component } from '@angular/core';
import { GenericService } from '../../../services/generic.service';
import { ICategory } from '../../../Models/icategory';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent {
  categories!: ICategory[];
  //subscriptions properties
  subscriptions: Subscription[] = [];
  //notifications properties
  notificationDurationInSeconds = 5;

  constructor(private genericService: GenericService<ICategory>,
              private snackBar: MatSnackBar
  ) {
  }

  public getAll(): void {
    this.subscriptions.push(this.genericService.getAll('category/all').subscribe({
      next: (data: ICategory[])=> {
        this.categories = data;
      },
      error: (err: Error) => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: "تعذر تحميل الفئات",
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    }));
  }

  
}
