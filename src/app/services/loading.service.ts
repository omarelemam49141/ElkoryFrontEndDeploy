import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject: BehaviorSubject<boolean>;
  loading$ : Observable<boolean>;

  loading: boolean = false;
  

  constructor() {
    this.loadingSubject  = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  show(): void {
    this.loadingSubject.next(true);
    this.loading = true;
  }

  hide(): void {
    this.loadingSubject.next(false);
    this.loading = false;
  }
}
