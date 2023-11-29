import { Component, OnInit } from '@angular/core';
import { ToolBoxGroup } from 'src/app/common/interfaces';
import { SVGEditorToolbox } from 'src/app/common/svg-editor-toolbox';

@Component({
  selector: 'app-svg-editor-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
})
export class SvgEditorToolboxComponent implements OnInit {
  toolbox: ToolBoxGroup[] = SVGEditorToolbox;
  constructor() {}

  ngOnInit(): void {}

  enteredEvent(event: any) {
    console.log('enter',event)
  }
}
