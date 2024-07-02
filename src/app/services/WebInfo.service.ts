// Assuming WebInfo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry } from 'rxjs';
import { IWebInfo } from '../Models/IwebsiteInfo';
import { environment } from '../../environment/environment';
import { IAddWebInfo } from '../Models/i-add-web-info';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class WebInfoService {
  private apiUrl = `${environment.apiUrl}/webinfo`;

  constructor(private http: HttpClient, private genericService: GenericService<IWebInfo>) {}

  getWebInfo(): Observable<IWebInfo> {
    return this.http.get<IWebInfo>(this.apiUrl);
  }

  addWebInfo(webInfo: IAddWebInfo): Observable<any> {
    this.genericService.addHeaders("Content-Type", "multipart/form-data");
    let formData = new FormData();
    formData.append('webLogo', webInfo.webLogo);
    return this.http.post<any>(this.apiUrl + 
      '?webPhone=' + webInfo.webPhone + '&webName=' + webInfo.webName + 
      '&instagramAccount=' + webInfo.instagramAccount + 
      '&facebookAccount=' + webInfo.facebookAccount + 
      '&description=' + webInfo.description + 
      '&storeAddress=' + webInfo.storeAddress + 
      '&CustomerServicePhone=' + webInfo.CustomerServicePhone,
      formData, this.genericService.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }

  updateWebInfo(webInfo: IAddWebInfo): Observable<any> {
    let formData = new FormData();
    formData.append('webLogo', webInfo.webLogo);
    return this.http.put<any>(this.apiUrl + 
      '?webPhone=' + webInfo.webPhone + '&webName=' +
       webInfo.webName + '&instagramAccount=' + 
       webInfo.instagramAccount + '&facebookAccount=' + 
       webInfo.facebookAccount + '&description=' + 
       webInfo.description + '&storeAddress=' + 
       webInfo.storeAddress + '&CustomerServicePhone=' + 
       webInfo.CustomerServicePhone,
      formData, this.genericService.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }
}
