import { Component, Inject, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-failed-snackbar',
  standalone: true,
  imports: [MatFormFieldModule, HttpClientModule, MatIconModule, MatSnackBarModule],
  templateUrl: './failed-snackbar.component.html',
  styleUrl: './failed-snackbar.component.scss'
})
export class FailedSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
  }

  dismissSnackbar() {
    this.snackBarRef.dismissWithAction();
  }
}

