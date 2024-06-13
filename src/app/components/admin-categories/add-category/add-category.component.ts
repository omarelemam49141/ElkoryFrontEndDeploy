import { Component } from '@angular/core';
import { GenericService } from '../../../services/generic.service';
import { ICategory } from '../../../Models/icategory';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  constructor(private genericService: GenericService<ICategory>) {    
  }

  public insert(category: ICategory): Observable<ICategory> {
    this.genericService.addHeaders("Content-Type", "application/json");
    return this.genericService.insert("category", category);
  }
}
