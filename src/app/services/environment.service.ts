import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkspaceObjectItemJson } from '../common/interfaces';
import { ScreenSizeType } from '../common/types';
import { TransmitService } from './transmit.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  svgEditorObjectsJson: WorkspaceObjectItemJson[] = [];
  private TABLET_SIZE = 1024;
  private MOBILE_SIZE = 640;
  currentScreenSize: ScreenSizeType = 'desktop';

  constructor(
    private _snackBar: MatSnackBar,
    private transmit: TransmitService
  ) {
    this.onResize();
  }

  errorSnackBar(message: string, durationAsSeconds = 2) {
    this._snackBar.open(message, undefined, {
      panelClass: 'error-snack',
      duration: 1000 * durationAsSeconds,
    });
  }

  onResize(event?: any) {
    if (window.innerWidth <= this.MOBILE_SIZE) {
      this.currentScreenSize = 'mobile';
    } else if (window.innerWidth <= this.TABLET_SIZE) {
      this.currentScreenSize = 'tablet';
    } else {
      this.currentScreenSize = 'desktop';
    }
    // if (event) {
    //   this.transmit.emit('resize-window', event);
    // }
  }
}
