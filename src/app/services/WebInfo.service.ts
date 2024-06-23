// Assuming WebInfo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWebInfo } from '../Models/IwebsiteInfo';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WebInfoService {
  private apiUrl = `${environment.apiUrl}/webinfo`;

  constructor(private http: HttpClient) {}

  getWebInfo(): Observable<IWebInfo> {
    return this.http.get<IWebInfo>(this.apiUrl);
  }
}
