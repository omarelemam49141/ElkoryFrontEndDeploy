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

  public getHeaders() {
    return this.httpOptions;
  }
  public addHeaders(key:string, value:string): void {
    this.httpOptions.headers.set(key, value);
  }

  public removeHeaders(key:string): void {
    this.httpOptions.headers.delete(key);
  }

  public handlingErrors(err: HttpErrorResponse) {
    if(err.status == 400) {
      return throwError(()=>err);
    }
    return throwError(()=>err);
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

  public update<T>(url: string, id: number, entity: T): Observable<any> {
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
