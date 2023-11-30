import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { EnvironmentService } from '../services/environment.service';
import { TransmitService } from '../services/transmit.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ToolBoxItem, WorkspaceObject } from '../common/interfaces';
import { SvgEditorEditPropertiesComponent } from './edit-properties/edit-properties.component';
import { SvgEditorSaveComponent } from './save/save.component';

@Component({
  selector: 'app-svg-editor',
  templateUrl: './svg-editor.component.html',
  styleUrls: ['./svg-editor.component.scss'],
})
export class SvgEditorComponent implements OnInit, AfterContentInit, OnDestroy {
  showToolbox = true;
  allowedMimeTypes = ['application/svg', 'image/svg+xml'];
  editMode = false;
  notifier = new Subject<void>();

  constructor(
    public env: EnvironmentService,
    protected transmit: TransmitService,
    protected dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // =>listen on open edit properties dialog
    this.transmit
      .listen<WorkspaceObject>('open-edit-properties')
      .pipe(takeUntil(this.notifier))
      .subscribe(object => {
        if (!object) return;
        this.dialog
          .open(SvgEditorEditPropertiesComponent, {
            data: object,
            minWidth: '60%',
          })
          .afterClosed()
          .pipe(takeUntil(this.notifier))
          .subscribe(data => {
            if (!data) {
              console.warn('no data!');
              return;
            }
            this.transmit.emit('update-workspace-object', data);
          });
      });
  }

  toggleToolbox() {
    this.showToolbox = !this.showToolbox;
  }

  ngAfterContentInit(): void {}

  uploadSvgImage(event: Event) {
    const target = event.target as any;
    const file = target['files'][0] as File;
    if (!this.allowedMimeTypes.includes(file.type)) {
      return this.env.errorSnackBar(
        `You can not import a file with "${file.type}" type. just svg files allowed!`,
        10
      );
    }
    this.transmit.emit('load-svg-file', file);
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
    this.transmit.emit('edit-workspace-mode', this.editMode);
  }
  save() {
    this.dialog.open(SvgEditorSaveComponent, {
      minWidth: '60%',
      data: {
        jsonData: this.env.svgEditorObjectsJson,
      }
    });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }
}
