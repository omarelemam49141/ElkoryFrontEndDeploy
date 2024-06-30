import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ISignUpModel } from '../Models/isign-up-model';
import { environment } from '../../environment/environment';
import { GenericService } from './generic.service';
import { BehaviorSubject, Observable, catchError, retry, throwError } from 'rxjs';
import { ILoginModel } from '../Models/ilogin-model';
import { IResetPassword } from '../Models/ireset-password';
import { IEditProfile } from '../Models/iedit-profile';
import * as jwtDecode  from 'jwt-decode';
import { IVerifyEmail } from '../Models/iverify-email';
import { IForgetPassword } from '../Models/iforget-password';
import { ICart } from '../Models/icart';

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnInit{
  public loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public loggedIn = "isLoggedIn";
  user?: {}

  constructor(private http: HttpClient,
              private genericService: GenericService<ISignUpModel>
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = false;
  }

  set isLoggedIn(value: boolean) {
    localStorage.setItem(this.loggedIn, JSON.stringify(value));
  }

  get isLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem(this.loggedIn) || 'false');
  }

  public signUp(signUpModel: ISignUpModel): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });

    return this.http.post<string>(`${environment.apiUrl}/Account/register`, signUpModel,{ headers, responseType: 'text' as 'json' })
    .pipe(
      catchError(this.genericService.handlingErrors)
    )
  }

  public activateLogin() {
    this.isLoggedIn = true;
    this.loggedInSubject.next(true);
  }

  public login(loginModel: ILoginModel): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`${environment.apiUrl}/Account/login`, loginModel, { observe: 'response' })
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
    
  }


  public resetPassword(resetPasswordModel: IResetPassword): Observable<any> {
    let token = localStorage.getItem("token");
    if (!token) {
      return throwError(()=>new Error("من فضلك قم باعادة تسجيل الدخول"))
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })

    return this.http.patch<any>(`${environment.apiUrl}/Account/resetpassword`, resetPasswordModel, {headers})
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

  public viewProfile(userEmail?: string): Observable<IEditProfile> {
    let email: string;
    const token = localStorage.getItem("token");
    if (!token) {
      return throwError(()=> new Error("قم باعادة تسجيل الدخول مرة أخرى"))
    }
    //get the token from the local storage
    if (!userEmail) {
      email = this.getTokenEmail();
    } else {
      email = userEmail;
    }

    //prepare the headers
    const headers = new HttpHeaders({
      'Authorization': token??''
    });
    
    //send the request
    return this.http.get<IEditProfile>(`${environment.apiUrl}/Account/userInfo?email=${email}`, {headers})
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

  public editProfile(editProfileModel: IEditProfile): Observable<any> {
    //get the token from the local storage
    const token = localStorage.getItem("token");
    if (!token) {
      return throwError(()=> new Error("قم باعادة تسجيل الدخول مرة أخرى"))
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": token
    })

    return this.http.patch<any>(`${environment.apiUrl}/Account/edit`, editProfileModel, {headers})
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

  public getEmailFromToken(token: string) {
    //decode the token and get the email from it
    let user: {} = jwtDecode.jwtDecode(token??'');
    const email = Object.values(user)[1];
    return email;
  }
  public getIdFromToken(token: string): any {
    //decode the token and get the email from it
    let user: {} = jwtDecode.jwtDecode(token??'');
    const id = Object.values(user)[0];
    return id;
  }

  public logout(): void {
    localStorage.removeItem("token");
    this.isLoggedIn = false;
    this.loggedInSubject.next(false);
    localStorage.removeItem("cart");
    //redirect to the home page
    window.location.href = "/";
  }

  public verifyEmail(verifyEmail: IVerifyEmail): Observable<any> {
    this.genericService.addHeaders("Content-Type", "application/json");
    return this.http.post<any>(`${environment.apiUrl}/Account/verify-email`, verifyEmail, this.genericService.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

  public forgetPasswordGettingCode(email: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Account/forgot-password?email=${email}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    )
  }

  public resetPasswordForgetPassword(forgetPasswordModel: IForgetPassword) : Observable<any> {
    this.genericService.addHeaders("Content-Type", "application/json");
    return this.http.post<any>(`${environment.apiUrl}/Account/forgot-password`, forgetPasswordModel, this.genericService.httpOptions);
  }

  public get decodedToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    return jwtDecode.jwtDecode(token??'');
  }

  public getTokenId() {
    let decodedToken = this.decodedToken;
    if (decodedToken) {
      return Object.values(decodedToken)[0];
    }
    return '';
  }

  public getTokenEmail() {
    let decodedToken = this.decodedToken;
    if (decodedToken) {
      return Object.values(decodedToken)[1];
    }
    return '';
  }

  public getTokenRole() {
    let decodedToken = this.decodedToken;
    if (decodedToken) {
      return Object.values(decodedToken)[2];
    }
    return '';
  }
}
