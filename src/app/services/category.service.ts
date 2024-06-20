import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { ICategory } from '../Models/icategory';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { IProduct } from '../Models/iproduct';
import { ISubCategory } from '../Models/isub-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private genericService: GenericService<ICategory>,
    private http: HttpClient
  ) { }

  public getAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${environment.apiUrl}/category/all`);
  }
  public getCategoryProducts(categoryId: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${environment.apiUrl}/category/${categoryId}`);
  }
  public getSubcategoriesbyCategoryID(categoryId:number):Observable<ISubCategory[]>{
    return this.http.get<ISubCategory[]>(`${environment.apiUrl}/subCategoryFromCategory/${categoryId}`);
  }

}
