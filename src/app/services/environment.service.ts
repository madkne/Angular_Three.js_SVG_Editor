import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  constructor(private _snackBar: MatSnackBar) {}

  errorSnackBar(message: string, durationAsSeconds = 2) {
    this._snackBar.open(message, undefined, {
      panelClass: 'error-snack',
      duration: 1000 * durationAsSeconds,
    });
  }
}
