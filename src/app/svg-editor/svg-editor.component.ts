import { AfterContentInit, Component, OnInit } from '@angular/core';
import { EnvironmentService } from '../services/environment.service';
import { TransmitService } from '../services/transmit.service';

@Component({
  selector: 'app-svg-editor',
  templateUrl: './svg-editor.component.html',
  styleUrls: ['./svg-editor.component.scss'],
})
export class SvgEditorComponent implements OnInit, AfterContentInit {
  showToolbox = true;
  allowedMimeTypes = ['application/svg', 'image/svg+xml'];

  constructor(
    protected env: EnvironmentService,
    protected transmit: TransmitService
  ) {}

  ngOnInit(): void {}

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
  save() {}
}
