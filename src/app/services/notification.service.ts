import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { inotification } from '../Models/inotification'; // Adjust path as per your application
import { AccountService } from './account.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:5112';

  constructor(
    private http: HttpClient,
    private _accountService: AccountService,
    private signalrService: SignalrService
  ) {}

  getAllNotifications(): Observable<inotification[]> {
    const userId = this._accountService.getIdFromToken(
      localStorage.getItem('token') || ''
    );
    return this.http.get<inotification[]>(
      `${this.apiUrl}/api/Notification/getAllNotifications/${userId}`
    );
  }

  markAllAsRead(): Observable<any> {
    const userId = this._accountService.getIdFromToken(
      localStorage.getItem('token') || ''
    );
    return this.http.post(
      `${this.apiUrl}/api/Notification/MarkAllAsRead/${userId}`,
      {}
    );
  }

  public onReceiveNotification(callback: (message: string,hiddenLink:string) => void): void {
    debugger;
    console.log('NotificationService: onReceiveNotification called');
    this.signalrService.onReceiveNotification(callback);
  }

  public onReceiveNotificationCount(callback: (count: number) => void): void {
    this.signalrService.onReceiveNotificationCount(callback);
  }

  public invokeGetNotificationCount(): void {
    this.signalrService.invokeGetNotificationCount();
  }
}
