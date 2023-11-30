import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToolBoxItem, WorkspaceObject } from 'src/app/common/interfaces';

@Component({
  selector: 'app-svg-editor-edit-properties',
  templateUrl: './edit-properties.component.html',
  styleUrls: ['./edit-properties.component.scss'],
})
export class SvgEditorEditPropertiesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SvgEditorEditPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkspaceObject
  ) {
    // =>normalize data tabs
    if (data.item.tabPropertiesFunc)
      data.item.tabProperties = data.item.tabPropertiesFunc();
  }

  ngOnInit(): void {}

  async save() {
    return this.dialogRef.close(this.data);
  }
}
