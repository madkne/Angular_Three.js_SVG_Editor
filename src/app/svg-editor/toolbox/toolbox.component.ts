import {
  AfterContentInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DraggedToolboxItemData,
  ToolBoxGroup,
  ToolBoxItem,
} from 'src/app/common/interfaces';
import { SVGEditorToolbox } from 'src/app/common/svg-editor-toolbox';
import { TransmitService } from 'src/app/services/transmit.service';

@Component({
  selector: 'app-svg-editor-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
})
export class SvgEditorToolboxComponent implements OnInit, AfterContentInit {
  toolbox: ToolBoxGroup[] = SVGEditorToolbox;
  workspaceBoundaryElement!: HTMLElement;
  draggedItem!: ToolBoxItem | undefined;

  constructor(protected transmit: TransmitService) {}

  ngOnInit(): void {
    // =>normalize tools
    for (const group of this.toolbox) {
      for (const tool of group.items) {
        if (!tool.tabProperties && tool.tabPropertiesFunc) {
          tool.tabProperties = tool.tabPropertiesFunc();
        }
      }
    }
  }

  ngAfterContentInit(): void {
    this.workspaceBoundaryElement = document.getElementById(
      'workspace-boundary'
    ) as HTMLElement;
  }

  startDragItem(event: DragEvent, item: ToolBoxItem) {
    this.draggedItem = item;
    event.dataTransfer?.setDragImage(
      document.getElementById('svg_toolbox_' + item.name) as HTMLElement,
      0,
      0
    );
  }
  draggingItem(event: DragEvent) {
    if (!this.draggingItem) return;
  }

  endDragItem(event: DragEvent) {
    // console.log('end', event);
    this.transmit.emit<DraggedToolboxItemData>('dragged-toolbox-item', {
      event,
      item: this.draggedItem as ToolBoxItem,
    });
    this.draggedItem = undefined;
  }
}
