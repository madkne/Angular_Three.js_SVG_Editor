import {
  AfterContentInit,
  Component,
  HostBinding,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MenuItem } from './common/interfaces';
import {
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { PageName } from './common/types';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TransmitService } from './services/transmit.service';
import { EnvironmentService } from './services/environment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  @ViewChild('drawer', { static: true }) public drawer!: MatDrawer;
  @ViewChild('mainMenu', { static: true }) public mainMenu!: MatSelectionList;
  selectedPage!: PageName;
  lightMode = false;
  @HostBinding('class') activeThemeCssClass!: string;

  mainMenuItems: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: 'dashboard',
      page: 'dashboard',
      disabled: true,
    },
    {
      text: 'SVG editor',
      icon: 'format_shapes',
      page: 'svg_editor',
    },
    {
      text: 'Application',
      icon: 'web_asset',
      page: 'application',
      disabled: true,
    },
    {
      text: '3D editor',
      icon: '3d_rotation',
      page: '3d_editor',
      disabled: true,
    },
  ];

  constructor(
    private overlayContainer: OverlayContainer,
    private transmit: TransmitService,
    public env: EnvironmentService
  ) {
    this.updateTheme();
  }

  toggleMainDrawer() {
    this.drawer.toggle();
    this.transmit.emit('resize-window', true);
  }

  toggleLightMode() {
    this.lightMode = !this.lightMode;
    this.updateTheme();
  }

  ngAfterContentInit(): void {
    this.drawer?.open();
    // =>select svg editor as default
    this.goToPage(this.mainMenuItems[1], true);
  }

  goToPage(item: MenuItem, selected: boolean) {
    this.mainMenuItems.map(i => (i.selected = false));
    item.selected = selected;
    this.selectedPage = item.page;
  }

  updateTheme() {
    const cssClass =
      this.lightMode === true ? 'deeppurple-amber' : 'pink-bluegrey-dark';

    const classList = this.overlayContainer.getContainerElement().classList;
    if (classList.contains(this.activeThemeCssClass))
      classList.replace(this.activeThemeCssClass, cssClass);
    else classList.add(cssClass);

    this.activeThemeCssClass = cssClass;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.env.onResize(event);
  }
}
