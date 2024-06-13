import { Component } from '@angular/core';
import { GenericService } from '../../../services/generic.service';
import { ICategory } from '../../../Models/icategory';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent {
  constructor(private genericService: GenericService<ICategory>) {    
  }

  public getById(categoryId: number): Observable<ICategory> {
    return this.genericService.getById('category',categoryId);
  }
}
