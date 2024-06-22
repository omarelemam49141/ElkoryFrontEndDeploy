import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { IUser } from '../Models/iuser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private genericService:GenericService<IUser>, private http:HttpClient) {}

  // GetAllAdmins():Observable<IAdmin[]>{
  //   return this.http.get<IAdmin[]>(`${environment.apiUrl}/admin`);
  // }

  GetAllUsers():Observable<IUser[]>{
    return this.http.get<IUser[]>(`${environment.apiUrl}/admin`);
  }

  AddAdmin(admin:IUser):Observable<IUser>{
    return this.http.post<IUser>(`${environment.apiUrl}/admin`,admin);
  }


  DeleteAdmin(adminId:number):Observable<IUser>{
    return this.http.delete<IUser>(`${environment.apiUrl}/admin/${adminId}`);
  }
}
