import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { inotification } from '../../../Models/inotification'; // Adjust path as per your application
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notify-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notify-bell.component.html',
  styleUrls: ['./notify-bell.component.scss'],
})
export class NotifyBellComponent implements OnInit, OnDestroy {
  notifications: inotification[] = [];
  notificationCount = 0;
  showNotifications = false;

  private notificationSubscription: Subscription = new Subscription();
  private notificationCountSubscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notificationService.onReceiveNotification((message) =>
      this.handleNewNotification(message)
    );
    this.notificationService.onReceiveNotificationCount((count) => {
      this.notificationCount = count;
      this.cdr.detectChanges();
    });

    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
    this.notificationCountSubscription.unsubscribe();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.markAllNotificationsAsRead();
    }
  }

  private loadNotifications() {
    this.notificationService
      .getAllNotifications()
      .subscribe((notifications) => {
        this.notifications = notifications;
        this.notificationCount = notifications.length;
        this.cdr.detectChanges(); // Manually trigger change detection
      });
  }

  private handleNewNotification(message: string) {
    debugger;
    console.log('New notification received: ' + message);

    const newNotification: inotification = {
      msgId: Date.now(), // Generate a unique ID for the notification
      userId: 11, // Replace with logic to get the current user ID
      title: 'New Notification',
      msgContent: message,
      sendingDate: new Date(),
      hiddenLink: '',
      seen: false,
    };

    this.notifications.unshift(newNotification);
    this.notificationCount++;
    this.cdr.detectChanges(); // Manually trigger change detection
  }
  private markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notificationCount = 0;
      this.notifications.forEach((notification) => (notification.seen = true));
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }
}
