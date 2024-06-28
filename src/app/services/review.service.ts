import { Injectable } from '@angular/core';
import { IRate } from '../Models/irate';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {


  constructor(private http: HttpClient) { }

  addReview(rate: IRate): Observable<IRate> {
    return this.http.post<IRate>(`${environment.apiUrl}/review`, rate);
  }

  getReview(productId: number, customerId: number): Observable<IRate> {
    return this.http.get<IRate>(`${environment.apiUrl}/review?productId=${productId}&customerId=${customerId}`);
  }
}
