import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { IAdmin } from '../Models/iadmin';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private genericService:GenericService<IAdmin>, private http:HttpClient) {}

  GetAllAdmins():Observable<IAdmin[]>{
    return this.http.get<IAdmin[]>(`${environment.apiUrl}/admin`);
  }
}
