import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  public urlToFile(url: string, fileName: string, mimeType: string): Promise<File> {
    return fetch(url)
          .then(response=>response.blob())
          .then(blob=> {
            return new File([blob], fileName, {type: mimeType})
          })
  }
}
