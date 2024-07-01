import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: signalR.HubConnection | null = null;
  private apiUrl = 'http://localhost:5112';
  private id: number = 0;

  constructor(private _accountService: AccountService) {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    const token = localStorage.getItem('token') || '';
    if (token) {
      this.id = this._accountService.getIdFromToken(token);
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.apiUrl}/notificationHub?userId=${this.id}`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => token,
        })
        .build();
      this.startConnection();
    } else {
      console.error('Token is missing');
    }
  }

  private startConnection(): void {
    if (this.hubConnection) {
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch((err) =>
          console.error('Error while starting connection: ' + err)
        );
    }
  }

  public onReceiveNotification(callback: (message: string,hiddenLink:string) => void): void {
    if (this.hubConnection) {
      debugger;
      this.hubConnection.on('ReceiveNotification', callback);
    }
  }

  public onReceiveNotificationCount(callback: (count: number) => void): void {
    if (this.hubConnection) {
      console.log('SignalrService: onReceiveNotificationCount called');
      this.hubConnection.on('ReceiveNotificationCount', callback);
    }
  }

  public invokeGetNotificationCount(): void {
    if (this.hubConnection) {
      this.hubConnection
        .invoke('GetNotificationCount')
        .catch((err) => console.error(err));
    }
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .then(() => console.log('Connection stopped'))
        .catch((err) =>
          console.error('Error while stopping connection: ' + err)
        );
    }
  }
}
