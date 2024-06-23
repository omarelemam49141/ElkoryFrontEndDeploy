import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedSnackbarComponent } from '../components/notifications/failed-snackbar/failed-snackbar.component';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const snackBar = inject(MatSnackBar);
  if (accountService.getTokenRole().toLowerCase() != "admin") {
    snackBar.openFromComponent(FailedSnackbarComponent, {
      data: "غير مسموح لك بالدخول!",
      duration: 5000
    })
    return false;
  }
  return true;
};
