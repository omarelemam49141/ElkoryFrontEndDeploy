import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { GenericService } from './generic.service';
import { IOrderModel } from '../Models/iorder-model';
import { IOrderModifiedPrice } from '../Models/iorder-modified-price';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient,
    private genericService: GenericService<IOrderModel>
  ) { }

  public getOrderModifiedPrice(offerId: number, userId: number): Observable<IOrderModifiedPrice> {
    return this.http.get<IOrderModifiedPrice>(`${environment.apiUrl}/Order/GetFinalPriceDetails/${offerId}/${userId}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }

  public getCustomerPreviousOrders(): Observable<IOrderModel[]> {
    return this.http.get<IOrderModel[]>(`${environment.apiUrl}/Order/GetCustomerPreviousOrders`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }
}
