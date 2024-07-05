import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { inotification } from '../../../Models/inotification'; // Adjust path as per your application
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
// Register the Arabic locale data
registerLocaleData(localeAr, 'ar');

@Component({
  selector: 'app-notify-bell',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    this.notificationService.onReceiveNotification((message, hiddenLink) =>
      this.handleNewNotification(message, hiddenLink)
    );
    this.notificationService.onReceiveNotificationCount((count) => {
      this.updateUnreadCount();
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
        console.log('Notifications loaded:', this.notifications);
        this.updateUnreadCount();
        this.cdr.detectChanges(); // Manually trigger change detection
      });
  }

  private handleNewNotification(message: string, hiddenLink: string) {
    const newNotification: inotification = {
      title: 'إشعار',
      msgContent: message,
      sendingDate: new Date(),
      hiddenLink: hiddenLink,
      seen: false,
    };

    this.notifications.unshift(newNotification);
    this.updateUnreadCount();
    this.playNotificationSound();
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  private markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach((notification) => (notification.seen = true));
      this.updateUnreadCount();
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }

  private updateUnreadCount() {
    // debugger;
    this.notificationCount = this.notifications.filter(
      (notification) => !notification.seen
    ).length;
  }

  private playNotificationSound() {
    const audio = new Audio('assets/notification.mp3');
    audio.play();
  }
}
