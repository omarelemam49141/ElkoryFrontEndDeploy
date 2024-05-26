import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, catchError, retry } from 'rxjs';

import { IProduct } from '../Models/iproduct';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ProductsPagination } from '../Models/products-pagination';
import { IAddProduct } from '../Models/iadd-product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private genericService: GenericService<IProduct>,
    private http: HttpClient
  ) { }

  public getAllWithPagination(pageNumber: number, pageSize: number): Observable<ProductsPagination> {
    return this.http.get<ProductsPagination>(`${environment.apiUrl}/products/pagination?page=${pageNumber}&pageSize=${pageSize}`);
  }

  public getAllWithPaginationAndSorting(pageNumber: number, pageSize: number, sort: string): Observable<ProductsPagination> {
    return this.http.options<ProductsPagination>(`${environment.apiUrl}/products/pagination?page=${pageNumber}&pageSize=${pageSize}&sortingIndex=${sort}`);
  }

  public getById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${environment.apiUrl}/${id}`);
  }

  public getPictures(productId: number): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/products/pictures?productId=${productId}`)
      .pipe(
        retry(2),
        catchError(this.genericService.handlingErrors)
      );
  }

  public deletePicture(productId:number, pictureUrl:string) {
    return this.http.delete(`${environment.apiUrl}/products/pictures?productId=${productId}&url=${pictureUrl}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }

  public insert(entity: IAddProduct): Observable<any> {
    this.genericService.addHeaders("Content-Type", "application/json");
    return this.genericService.insert<IAddProduct>('product', entity);
  }

  public insertPictures(id: number, pictures: FileList): Observable<any> {
    const formData = new FormData();
    for (let index = 0; index < pictures.length; index++) {
      formData.append(`Pictures`, pictures[index], pictures[index].name);
    }

    this.genericService.addHeaders("Content-Type", "multipart/form-data");
    return this.http.post<any>(`${environment.apiUrl}/products/pictures?productId=${id}`, formData)
      .pipe(
        retry(2),
        catchError(this.genericService.handlingErrors)
      );
  }

  public update(id: number, entity: IAddProduct): Observable<any> {
    this.genericService.addHeaders("Content-Type", "application/json");
    return this.http.put<IAddProduct>(`${environment.apiUrl}/product?Id=${id}`, entity);
  }

  public delete(id: number): Observable<any> {
    return this.genericService.delete('product', id);
  }
}
