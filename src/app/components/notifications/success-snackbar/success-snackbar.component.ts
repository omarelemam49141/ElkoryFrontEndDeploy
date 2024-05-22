import { Component, Inject, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-success-snackbar',
  standalone: true,
  imports: [MatIconModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './success-snackbar.component.html',
  styleUrl: './success-snackbar.component.scss'
})
export class SuccessSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
  }

  dismissSnackbar() {
    this.snackBarRef.dismissWithAction();
  }
}


