import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { ICategory } from '../Models/icategory';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry } from 'rxjs';
import { environment } from '../../environment/environment';

import { ISubCategoryValue } from '../Models/isub-category-value';

import { IProduct } from '../Models/iproduct';
import { ISubCategory } from '../Models/isub-category';
import { ICategorySubCategoriesValues } from '../Models/icategory-sub-categories-values';
import { IProductCategorySubValues } from '../Models/iproduct-category-sub-values';
import { ISubCategoryCategoryValues } from '../Models/isub-category-category-values';

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

  public getCategorySubCategoriesWithValues(categoryId: number): Observable<ICategorySubCategoriesValues> {
    return this.http.get<ICategorySubCategoriesValues>(`${environment.apiUrl}/CategoryDetails/${categoryId}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

  public addProductCategorySubCategoryValue(value: IProductCategorySubValues) {
    console.log(value)
    this.genericService.addHeaders("Content-Type", "application/json");
    return this.http.post(`${environment.apiUrl}/ProductCategorySubCategoryValues`, value, this.genericService.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

  public getCategoriesWithValuesBySubCategoryId(subCategoryId: number): Observable<ISubCategoryCategoryValues> {
    return this.http.get<ISubCategoryCategoryValues>(`${environment.apiUrl}/SubCategoryDetails/${subCategoryId}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }
}
