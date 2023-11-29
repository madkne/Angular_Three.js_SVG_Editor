import {
  AfterContentInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ToolBoxGroup, ToolBoxItem } from 'src/app/common/interfaces';
import { SVGEditorToolbox } from 'src/app/common/svg-editor-toolbox';

@Component({
  selector: 'app-svg-editor-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
})
export class SvgEditorToolboxComponent implements OnInit, AfterContentInit {
  toolbox: ToolBoxGroup[] = SVGEditorToolbox;
  workspaceBoundaryElement!: HTMLElement;
  draggedItem!: ToolBoxItem | undefined;

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.workspaceBoundaryElement = document.getElementById(
      'workspace-boundary'
    ) as HTMLElement;
  }

  startDragItem(event: DragEvent, item: ToolBoxItem) {
    this.draggedItem = item;
    event.dataTransfer?.setDragImage(
      document.getElementById('svg_toolbox_' + item.title) as HTMLElement,
      0,
      0
    );
  }
  draggingItem(event: DragEvent) {
    if (!this.draggingItem) return;
  }

  endDragItem(event: DragEvent) {
    console.log('end', event);
    //TODO:
    this.draggedItem = undefined;
  }
}
