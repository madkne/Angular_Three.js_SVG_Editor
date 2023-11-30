import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-svg-editor-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SvgEditorSaveComponent implements OnInit {
  constructor( public dialogRef: MatDialogRef<SvgEditorSaveComponent>,@Inject(MAT_DIALOG_DATA) public data:{jsonData:{}} ) {}

  ngOnInit(): void {}
}
