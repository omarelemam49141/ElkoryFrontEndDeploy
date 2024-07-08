import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import * as jwtDecode  from 'jwt-decode';
import { IEditProfile } from '../../../Models/iedit-profile';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  user!: {email: string, password: string};

  profileInfo!: IEditProfile;

  profileRole: string = 'customer';
  
  //notifications properties
  snackBarDuration = 5;

  //subscription properties
  subscriptions?: Subscription[] = [];
  constructor(private accountService: AccountService,
              private snackBar: MatSnackBar
  ) {
  }
  //start observers
  profileObserver = {
    next: (profile: IEditProfile) => {
      this.profileInfo = profile;
      console.log(this.profileInfo)
    },
    error: (err: any) => {
      this.snackBar.openFromComponent(FailedSnackbarComponent, {
        data: 'تعذر تحميل الملف الشخصي',
        duration: this.snackBarDuration * 1000
      })
    },
  }
  ngOnInit(): void {
    this.profileRole = this.accountService.getTokenRole().toLowerCase();
    this.subscriptions?.push(this.accountService.viewProfile().subscribe(this.profileObserver));
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub=>sub.unsubscribe());
  }
}
