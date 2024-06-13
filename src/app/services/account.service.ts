import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISignUpModel } from '../Models/isign-up-model';
import { environment } from '../../environment/environment';
import { GenericService } from './generic.service';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ILoginModel } from '../Models/ilogin-model';
import { IResetPassword } from '../Models/ireset-password';
import { IEditProfile } from '../Models/iedit-profile';
import * as jwtDecode  from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public isLoggedIn: boolean = false;
  user?: {}

  constructor(private http: HttpClient,
              private genericService: GenericService<ISignUpModel>
  ) { }

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

  public viewProfile(): Observable<IEditProfile> {
    //get the token from the local storage
    const token = localStorage.getItem("token");
    if (!token) {
      return throwError(()=> new Error("قم باعادة تسجيل الدخول مرة أخرى"))
    }
    //decode the token and get the email from it
    let user: {} = jwtDecode.jwtDecode(token??'');
    const email = Object.values(user)[0];

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

  public logout(): void {
    localStorage.removeItem("token");
    this.isLoggedIn = false;
  }
}
