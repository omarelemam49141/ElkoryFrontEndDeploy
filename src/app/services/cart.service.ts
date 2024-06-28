import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, catchError, retry, throwError } from 'rxjs';
import { ICart } from '../Models/icart';
import  * as jwtDecode  from 'jwt-decode';
import { GenericService } from './generic.service';
import { environment } from '../../environment/environment';
import { IUpdateCart } from '../Models/iupdate-cart';
import { AccountService } from './account.service';
import { IReviewOrder } from '../Models/ireview-order';
import { IProduct } from '../Models/iproduct';

@Injectable({
  providedIn: 'root'
})

export class CartService{
  constructor(private http: HttpClient,
    private genericServcie: GenericService<ICart>,
    private accountService: AccountService
  ) { }

  getLoggedInUserEmail() : string | null{
    //get the token and decode it
    let token = localStorage.getItem("token");
    if(!token) {
      return null
    }
    let user = jwtDecode.jwtDecode(token);
    const userEmail = Object.values(user)[0];
    return userEmail;
  }

  public displayCart(userId: string): Observable<ICart> {
    //get the cart
    return this.http.get<ICart>(`${environment.apiUrl}/cart/${+userId}`)
    .pipe(
      retry(2),
      catchError(this.genericServcie.handlingErrors)
    );
  }
  
  public deleteCart(userId: string): Observable<any> {
    //get the cart
    return this.http.delete<any>(`${environment.apiUrl}/Cart/${userId}`)
    .pipe(
      retry(2),
      catchError(this.genericServcie.handlingErrors)
    );
  }

  public updateCart(cart: ICart): Observable<any> {
    //get the token and decode it
    let userId = this.accountService.getTokenId();
    if (!userId) {
      return throwError(()=> new Error("قم بإعادة تسجيل الدخول مرة أخرى"))
    }

    //get the products ids in an array
    let productsIds = cart.productsAmounts.map(product => product.productId);
    //get the products amounts in an array
    let productsAmounts = cart.productsAmounts.map(product => product.amount);
    //make an IUpdateCart object
    let updateCart: IUpdateCart = {
      userId: userId,
      productsIds: productsIds,
      amounts: productsAmounts
    }

    //set the headers
    this.genericServcie.addHeaders("Content-Type", "application/json");

    //update the cart
    return this.http.put<any>(`${environment.apiUrl}/cart`, updateCart, this.genericServcie.getHeaders())
    .pipe(
      retry(2),
      catchError(this.genericServcie.handlingErrors)
    );
  }

  public getOrderInfo(userId: number): Observable<IReviewOrder> {
    return this.http.get<IReviewOrder>(`${environment.apiUrl}/Order?userId=${userId}`)
    .pipe(
      retry(2),
      catchError(this.genericServcie.handlingErrors)
    );
  }
  

  public addToCart(product: IProduct): Observable<any> {
    let userId = this.accountService.getTokenId();
    this.genericServcie.addHeaders("Content-Type", "application/json");
    return this.http.post<any>(`${environment.apiUrl}/cart?userId=${userId}&productId=${product.productId}&amount=${product.amount}`, {}, this.genericServcie.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericServcie.handlingErrors)
    );
  }

}
