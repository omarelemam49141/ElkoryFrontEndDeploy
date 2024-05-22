import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService<TEntity> {
  httpOptions = {
    "headers": new HttpHeaders({})
  }

  constructor(private http: HttpClient) { }

  public addHeaders(key:string, value:string): void {
    this.httpOptions.headers.set(key, value);
  }

  public removeHeaders(key:string): void {
    this.httpOptions.headers.delete(key);
  }

  public handlingErrors(err: HttpErrorResponse) {
    return throwError(()=>new Error("حدث خطأ ما برجاء المحاولة لاحقا"));
  }

  public getAllWithPagination(url: string, pageNumber: number, pageSize: number): Observable<TEntity[]> {
    return this.http.get<TEntity[]>(`${environment.apiUrl}/${url}?page=${pageNumber}&pageSize=${pageSize}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handlingErrors)
    );
  }

  public getById(url: string, id: number): Observable<TEntity> {
    return this.http.get<TEntity>(`${environment.apiUrl}/${url}/${id}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handlingErrors)
    );
  }

  public insert<T>(url: string, entity:T): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/${url}`, entity, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handlingErrors)
    );
  }

  public update(url: string, id: number, entity: TEntity): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/${url}/${id}`, entity, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handlingErrors)
    );
  }

  public delete(url: string, id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/${url}?id=${id}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handlingErrors)
    );
  }
}
