import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-svg-editor',
  templateUrl: './svg-editor.component.html',
  styleUrls: ['./svg-editor.component.scss'],
})
export class SvgEditorComponent implements OnInit, AfterContentInit {
  @ViewChild('toolbox', { static: true }) public toolbox!: MatDrawer;

  constructor() {}

  ngOnInit(): void {}

  toggleToolbox() {
    this.toolbox.toggle();
  }

  ngAfterContentInit(): void {
    this.toolbox?.open();
  }

  uploadSvgImage() {}

  save() {}
}
