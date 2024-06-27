import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { IUser } from '../Models/iuser';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry } from 'rxjs';
import { environment } from '../../environment/environment';
import { IAdmin } from '../Models/iadmin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private genericService:GenericService<IUser>, private http:HttpClient) {}

  // GetAllAdmins():Observable<IAdmin[]>{
  //   return this.http.get<IAdmin[]>(`${environment.apiUrl}/admin`);
  // }

  GetAllUsers():Observable<IUser[]>{
    return this.http.get<IUser[]>(`${environment.apiUrl}/admin/GetUsers`);
  }

  AddAdmin(admin:IUser):Observable<IUser>{
    return this.http.post<IUser>(`${environment.apiUrl}/admin`,admin)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }

  updateAdmin(adminId:number, admin:IUser):Observable<any>{
    console.log(admin)
    return this.http.put<any>(`${environment.apiUrl}/admin/${adminId}`,admin)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }

  getAdminById(adminId: number): Observable<IUser> {
    console.log(adminId)
    return this.http.get<IUser>(`${environment.apiUrl}/Admin/${adminId}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );;
  }


  DeleteUser(adminId:number):Observable<IUser>{
    return this.http.delete<IUser>(`${environment.apiUrl}/admin/${adminId}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }
}
