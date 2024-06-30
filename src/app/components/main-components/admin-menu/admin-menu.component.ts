import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminNotificationsService } from '../../../services/admin-notifications.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss'
})
export class AdminMenuComponent implements OnInit {
  constructor(public adminNotificationsService: AdminNotificationsService) {

  }
  ngOnInit(): void {
    this.adminNotificationsService.getNumberOfPendingOrders();
  }
}
