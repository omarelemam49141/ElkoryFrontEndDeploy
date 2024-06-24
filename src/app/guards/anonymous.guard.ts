import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedSnackbarComponent } from '../components/notifications/failed-snackbar/failed-snackbar.component';

export const anonymousGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const snackBar = inject(MatSnackBar);
  if (accountService.decodedToken != null) {
    snackBar.openFromComponent(FailedSnackbarComponent, {
      data: "عليك تسجيل الخروج أولا",
      duration: 5000
    })
  }
  return accountService.decodedToken ? false : true;
};
