import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { ICategory } from '../Models/icategory';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry } from 'rxjs';
import { environment } from '../../environment/environment';

import { ISubCategoryValue } from '../Models/isub-category-value';

import { IProduct } from '../Models/iproduct';
import { ISubCategory } from '../Models/isub-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private genericService: GenericService<ICategory>,
    private http: HttpClient
  ) { }

  public addSubCategoryValue(subCategoryValue: ISubCategoryValue) {
    this.genericService.addHeaders("Content-Type", "multipart/form-data");
    let formData = new FormData();
    formData.append("image", subCategoryValue.image);
    return this.http.post(`${environment.apiUrl}/CategorySubCategoryValues?subCategoryId=${subCategoryValue.subCategoryId}&categoryId=${subCategoryValue.categoryId}&value=${subCategoryValue.newValue}`, formData, this.genericService.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

  public updateSubCategoryValue(subCategoryValue: ISubCategoryValue) {
    this.genericService.addHeaders("Content-Type", "multipart/form-data");
    let formData = new FormData();
    formData.append("image", subCategoryValue.image);
    return this.http.patch(`${environment.apiUrl}/subCategoryValue?subCategoryId=${subCategoryValue.subCategoryId}&categoryId=${subCategoryValue.categoryId}&value=${subCategoryValue.value}&newValue=${subCategoryValue.newValue}`, formData, this.genericService.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

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
