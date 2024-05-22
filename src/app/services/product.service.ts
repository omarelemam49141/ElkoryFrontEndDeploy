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
    return this.genericService.getById('products', id);
  }

  public insert(entity: IAddProduct): Observable<any> {
    this.genericService.addHeaders("Content-Type", "application/json");
    return this.genericService.insert<IAddProduct>('product', entity);
  }

  public update(id: number, entity: IProduct): Observable<any> {
    this.genericService.addHeaders("Content-Type", "application/json");
    return this.genericService.update('products', id, entity);
  }

  public delete(id: number): Observable<any> {
    return this.genericService.delete('product', id);
  }

  public getImages(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/products/pictures?productId=${id}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }
}
