import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { ICategory } from '../Models/icategory';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry } from 'rxjs';
import { environment } from '../../environment/environment';
import { ISubCategoryValue } from '../Models/isub-category-value';

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
    return this.http.post(`${environment.apiUrl}/CategorySubCategoryValues?categoryId=${subCategoryValue.categoryId}&subCategoryId=${subCategoryValue.subCategoryId}&value=${subCategoryValue.value}`, formData, this.genericService.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

  public updateSubCategoryValue(subCategoryValue: ISubCategoryValue) {
    this.genericService.addHeaders("Content-Type", "multipart/form-data");
    let formData = new FormData();
    formData.append("image", subCategoryValue.image);
    return this.http.patch(`${environment.apiUrl}/subCategoryValue/${subCategoryValue.subCategoryId}?categoryId=${subCategoryValue.categoryId}&value=${subCategoryValue.value}`, formData, this.genericService.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }
}
